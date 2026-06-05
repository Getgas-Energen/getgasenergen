import { Link } from "@tanstack/react-router";
import { Flame, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-steel text-steel-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-white/10">
                <Flame className="h-5 w-5 text-accent" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold">
                Getgas <span className="text-accent">Energen</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Engineering gas reticulation, bulk LPG storage and safe piped gas
              infrastructure across Kenya and beyond.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/projects" className="hover:text-accent">Projects</Link></li>
              <li><Link to="/marketplace" className="hover:text-accent">Marketplace</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Engineering</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>Gas reticulation design</li>
              <li>Bulk LPG storage</li>
              <li>Installation & commissioning</li>
              <li>Inspection & maintenance</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>info@getgaske.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Getgas Energen Ltd. All rights reserved.</p>
          <p>EPRA & Petroleum Act 2019 compliant · Founded 2016</p>
        </div>
      </div>
    </footer>
  );
}
