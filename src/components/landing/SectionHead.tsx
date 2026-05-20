type Props = {
  eyebrow: string;
  heading: string;
  brandWords?: number;
  lede: string;
};

export function SectionHead({ eyebrow, heading, brandWords = 0, lede }: Props) {
  const words = heading.split(" ");
  const head =
    brandWords > 0 ? (
      <>
        <span className="brand-2">{words.slice(0, brandWords).join(" ")}</span>{" "}
        {words.slice(brandWords).join(" ")}
      </>
    ) : (
      heading
    );

  return (
    <div className="section-head reveal">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="h2">{head}</h2>
      </div>
      <p className="lede">{lede}</p>
    </div>
  );
}
