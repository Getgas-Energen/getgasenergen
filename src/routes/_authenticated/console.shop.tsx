import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  listProductsAdmin,
  saveProduct,
  deleteProduct,
  type AdminProductRow,
} from "@/lib/admin.functions";
import { useAccess } from "./console";

export const Route = createFileRoute("/_authenticated/console/shop")({
  head: () => ({
    meta: [
      { title: "Marketplace | Getgas Energen Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConsoleShop,
});

const categoryOptions = [
  { value: "pipes", label: "Pipes & Fittings" },
  { value: "regulators", label: "Regulators & Valves" },
  { value: "fireplaces", label: "Fireplaces" },
  { value: "cylinders", label: "Cylinders & Manifolds" },
  { value: "safety", label: "Safety Accessories" },
  { value: "other", label: "Other" },
] as const;

type Draft = {
  id: string | null;
  name: string;
  category: AdminProductRow["category"];
  spec: string;
  description: string;
  priceKes: string;
  imageUrl: string;
  inStock: boolean;
  isActive: boolean;
  sortOrder: string;
};

const emptyDraft: Draft = {
  id: null,
  name: "",
  category: "other",
  spec: "",
  description: "",
  priceKes: "",
  imageUrl: "",
  inStock: true,
  isActive: true,
  sortOrder: "100",
};

function ConsoleShop() {
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);
  const queryClient = useQueryClient();

  const fetchProducts = useServerFn(listProductsAdmin);
  const save = useServerFn(saveProduct);
  const remove = useServerFn(deleteProduct);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts({}),
  });

  const [draft, setDraft] = useState<Draft | null>(null);

  const saveMutation = useMutation({
    mutationFn: (d: Draft) =>
      save({
        data: {
          id: d.id,
          name: d.name,
          category: d.category,
          spec: d.spec || null,
          description: d.description || null,
          priceKes: d.priceKes.trim() === "" ? null : Number(d.priceKes),
          imageUrl: d.imageUrl || null,
          inStock: d.inStock,
          isActive: d.isActive,
          sortOrder: Number(d.sortOrder || 100),
        },
      }),
    onSuccess: () => {
      toast.success("Item saved");
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Item deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete"),
  });

  const products = data?.products ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Marketplace items</h1>
          <p className="text-sm text-muted-foreground">
            Items with a price can be bought and paid by M-Pesa. Items without a price show "Price on request".
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setDraft(emptyDraft)}>
            <Plus className="mr-2 h-4 w-4" /> New item
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price (KES)</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{p.name}</p>
                    {p.spec && <p className="text-xs text-muted-foreground">{p.spec}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {categoryOptions.find((c) => c.value === p.category)?.label ?? p.category}
                  </td>
                  <td className="px-4 py-3">
                    {p.price_kes === null ? (
                      <span className="text-muted-foreground">On request</span>
                    ) : (
                      Number(p.price_kes).toLocaleString("en-KE")
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.in_stock ? "In stock" : "Out"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.is_active ? "Yes" : "Hidden"}</td>
                  <td className="px-4 py-3 text-right">
                    {isAdmin && (
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit item"
                          onClick={() =>
                            setDraft({
                              id: p.id,
                              name: p.name,
                              category: p.category,
                              spec: p.spec ?? "",
                              description: p.description ?? "",
                              priceKes: p.price_kes === null ? "" : String(Number(p.price_kes)),
                              imageUrl: p.image_url ?? "",
                              inStock: p.in_stock,
                              isActive: p.is_active,
                              sortOrder: String(p.sort_order),
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete item"
                          onClick={() => {
                            if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit item" : "New item"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={draft.category}
                    onValueChange={(v) => setDraft({ ...draft, category: v as Draft["category"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price in KES (blank = on request)</Label>
                  <Input
                    id="price"
                    inputMode="decimal"
                    value={draft.priceKes}
                    onChange={(e) => setDraft({ ...draft, priceKes: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="spec">Specification</Label>
                <Input id="spec" value={draft.spec} onChange={(e) => setDraft({ ...draft, spec: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="imageUrl">Image link (optional)</Label>
                  <Input
                    id="imageUrl"
                    value={draft.imageUrl}
                    onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sortOrder">Display order</Label>
                  <Input
                    id="sortOrder"
                    inputMode="numeric"
                    value={draft.sortOrder}
                    onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="inStock">In stock</Label>
                <Switch
                  id="inStock"
                  checked={draft.inStock}
                  onCheckedChange={(v) => setDraft({ ...draft, inStock: v })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="isActive">Show on the website</Label>
                <Switch
                  id="isActive"
                  checked={draft.isActive}
                  onCheckedChange={(v) => setDraft({ ...draft, isActive: v })}
                />
              </div>
              <Button
                className="w-full"
                disabled={saveMutation.isPending || draft.name.trim().length < 2}
                onClick={() => saveMutation.mutate(draft)}
              >
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save item
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
