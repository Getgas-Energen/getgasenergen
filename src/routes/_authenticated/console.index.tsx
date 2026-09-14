import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Paperclip, Download, Mail, Phone } from "lucide-react";
import { listEnquiries, getAttachmentLink, updateEnquiryStatus } from "@/lib/admin.functions";
import { useAccess } from "./console";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/console/")({
  head: () => ({
    meta: [
      { title: "Enquiries | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: EnquiriesPage,
});

const STATUSES = ["new", "in_progress", "quoted", "won", "closed"] as const;

function EnquiriesPage() {
  const queryClient = useQueryClient();
  const { data: access } = useAccess();
  const fetchEnquiries = useServerFn(listEnquiries);
  const fetchLink = useServerFn(getAttachmentLink);
  const setStatus = useServerFn(updateEnquiryStatus);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => fetchEnquiries({}),
  });

  const download = async (path: string) => {
    try {
      const { url } = await fetchLink({ data: { path } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open the file.");
    }
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      await setStatus({ data: { id, status: status as (typeof STATUSES)[number] } });
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every enquiry submitted through the website, newest first.
      </p>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {data && data.enquiries.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No enquiries yet.</p>
      )}

      <div className="mt-6 space-y-3">
        {data?.enquiries.map((e) => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  {e.name}
                  {e.company ? <span className="text-muted-foreground"> · {e.company}</span> : null}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-accent">{e.project_type}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                    <Mail className="h-3.5 w-3.5" /> {e.email}
                  </a>
                  <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                    <Phone className="h-3.5 w-3.5" /> {e.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleString("en-GB")}
                </p>
                {access?.isAdmin ? (
                  <Select value={e.status} onValueChange={(v) => changeStatus(e.id, v)}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {e.status.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>

            <p
              className={
                expanded === e.id
                  ? "mt-4 whitespace-pre-line text-sm text-foreground"
                  : "mt-4 line-clamp-2 whitespace-pre-line text-sm text-foreground"
              }
            >
              {e.message}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {expanded === e.id ? "Show less" : "Read full message"}
              </button>
              {e.attachment_path && (
                <Button size="sm" variant="outline" onClick={() => download(e.attachment_path!)}>
                  <Paperclip className="mr-2 h-3.5 w-3.5" />
                  Attachment
                  <Download className="ml-2 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
