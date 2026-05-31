type Props = {
  id?: string;
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
};

export function PageSection({ id, title, description, badge, children, className = "" }: Props) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="font-serif text-xl text-stone-900 sm:text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
        </div>
        {badge && (
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
