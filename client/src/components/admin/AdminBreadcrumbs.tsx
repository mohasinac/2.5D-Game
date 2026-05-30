import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  path?: string;
}

interface Props {
  crumbs: Crumb[];
}

export function AdminBreadcrumbs({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-theme-muted mb-4 flex-wrap">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="opacity-40">/</span>}
            {crumb.path && !isLast ? (
              <Link to={crumb.path} className="hover:text-theme-text transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? "text-theme-text font-medium" : ""}>{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
