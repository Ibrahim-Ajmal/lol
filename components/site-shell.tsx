"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [{ href: "/chat", label: "Chat" }, { href: "/plans", label: "Plans" }, { href: "/history", label: "History" }, { href: "/account", label: "Account" }];
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="site-bg" style={{ minHeight: "100vh" }}>
    <header className="container nav">
      <Link href="/" className="brand"><span className="brand-mark">✧</span><span>BONIT <span style={{color:"#9da8be"}}>AI</span></span></Link>
      <nav className="nav-links" aria-label="Main navigation">
        {links.map(link => <Link key={link.href} href={link.href} style={{color:pathname===link.href?"#fff":undefined}}>{link.label}</Link>)}
      </nav>
      <Link href="/chat" className="btn">Start chatting <span>↗</span></Link>
    </header>
    <main>{children}</main>
    <footer className="footer"><div className="container footer-inner">
      <div><div className="brand" style={{fontSize:12,marginBottom:9}}><span className="brand-mark" style={{width:23,height:23,fontSize:11}}>✧</span>BONIT AI</div><span>Think beyond the obvious.</span></div>
      <div className="footer-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/refunds">Refunds</Link><Link href="/settings">Settings</Link></div>
      <span>© {new Date().getFullYear()} BONIT AI</span>
    </div></footer>
  </div>;
}
