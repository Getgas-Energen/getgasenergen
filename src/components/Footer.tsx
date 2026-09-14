import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import logoAsset from "@/assets/getgas-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[var(--royal-deep)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-white p-1.5">
                <img src={logoAsset.url} alt="Getgas Energen" className="h-full w-auto" />
              </span>
              <span className="font-display text-lg font-bold">
                Getgas <span className="text-accent">Energen</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-sm">
              The engineering, EPC, metering and safety division of Getgas Holdings PLC.
              Designing East Africa's LPG infrastructure.
            </p>
            <p className="mt-4 text-xs text-white/55 italic">
              Design. Build. Meter. Protect. Operate. Scale.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/industries" className="hover:text-accent">Industries</Link></li>
              <li><Link to="/projects" className="hover:text-accent">Projects</Link></li>
              <li><Link to="/marketplace" className="hover:text-accent">Marketplace</Link></li>
              <li><Link to="/insights" className="hover:text-accent">Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">Solutions</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link to="/smart-metering" className="hover:text-accent">Smart Metering & Vending</Link></li>
              <li><Link to="/safety-systems" className="hover:text-accent">Safety Systems</Link></li>
              <li>EPC Delivery</li>
              <li>Operations & Maintenance</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>Tatu City, Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>+254 702 947 573</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>getgasenergenkenya@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-white/10 bg-white/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-accent">Also from Getgas:</span> Cooking gas on demand via AGREGAS Marketplace.
          </p>
          <a
            href="https://getgas.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Visit AGREGAS <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55">
          <p>© {new Date().getFullYear()} Getgas Energen Ltd · A Getgas Holdings PLC company.</p>
          <p className="flex items-center gap-3">
            <span>EPRA · KEBS · Petroleum Act 2019 compliant</span>
            <Link to="/staff-login" rel="nofollow" className="text-white/40 hover:text-accent">Staff</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
