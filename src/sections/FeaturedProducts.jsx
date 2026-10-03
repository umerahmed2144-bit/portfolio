import { products, productsIntro } from "../content";
import Reveal from "../components/Reveal";
import LiquidImage from "../components/LiquidImage";
import TodoLink from "../components/TodoLink";
import SectionHead from "./SectionHead";
import "./FeaturedProducts.css";

function Status({ product }) {
  return <span className={`badge${product.tone === "live" ? " is-live" : ""}`}>{product.status}</span>;
}

function Stack({ items }) {
  return (
    <ul className="chips" aria-label="Built with">
      {items.map((s) => (
        <li className="chip" key={s}>{s}</li>
      ))}
    </ul>
  );
}

function LiveLink({ product }) {
  return (
    <TodoLink href={product.url} className="btn btn-ghost product-link" external pendingLabel="Live link coming soon">
      View live
      <span className="arrow" aria-hidden="true">↗</span>
    </TodoLink>
  );
}

function CaseStudy({ product }) {
  const [main, ...thumbs] = product.images;
  return (
    <article id={`product-${product.id}`} className="case group">
      <Reveal className="case-media" y={60} duration={620}>
        <LiquidImage
          src={main}
          alt={`${product.name} screenshot`}
          placeholderLabel={product.name}
          className="case-main"
        />
        {thumbs.length > 0 && (
          <div className="case-thumbs">
            {thumbs.map((src, i) => (
              <LiquidImage
                key={i}
                src={src}
                alt={`${product.name} screenshot ${i + 2}`}
                scaleTo={22}
                className="case-thumb"
              />
            ))}
          </div>
        )}
      </Reveal>

      <div className="case-body">
        <Reveal className="case-meta" delay={80}>
          <span className="case-index display">01</span>
          <Status product={product} />
        </Reveal>
        <Reveal delay={120}>
          <h3 className="display case-name">{product.name}</h3>
          <p className="case-tagline">{product.tagline}</p>
          <p className="label case-audience">{product.audience}</p>
        </Reveal>
        <dl className="case-blocks">
          {product.blocks.map((b, i) => (
            <Reveal key={b.title} className="case-block" delay={160 + i * 90}>
              <dt className="label">{b.title}</dt>
              <dd>{b.body}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal className="case-foot" delay={200}>
          <Stack items={product.stack} />
          <LiveLink product={product} />
        </Reveal>
      </div>
    </article>
  );
}

function ProductCard({ product, index }) {
  const offset = index % 2 === 1;
  return (
    <Reveal
      as="li"
      id={`product-${product.id}`}
      className={`product${offset ? " is-offset" : ""}`}
      y={60}
      duration={620}
      delay={offset ? 120 : 0}
    >
      <article className="group">
        <LiquidImage
          src={product.images[0]}
          alt={`${product.name} screenshot`}
          placeholderLabel={product.name}
          className="product-img"
        />
        <div className="product-row">
          <div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-tagline">{product.tagline}</p>
          </div>
          <div className="product-side">
            <span className="label">{String(index + 2).padStart(2, "0")}</span>
            <Status product={product} />
          </div>
        </div>
        <p className="label product-audience">{product.audience}</p>
        <dl className="product-blocks">
          {product.blocks.map((b) => (
            <div key={b.title} className="product-block">
              <dt className="label">{b.title}</dt>
              <dd>{b.body}</dd>
            </div>
          ))}
        </dl>
        <div className="product-foot">
          <Stack items={product.stack} />
          <LiveLink product={product} />
        </div>
      </article>
    </Reveal>
  );
}

export default function FeaturedProducts() {
  const [lead, ...rest] = products;
  return (
    <section id="work" className="section work">
      <SectionHead eyebrow={productsIntro.eyebrow} heading={productsIntro.heading} aside={productsIntro.count} />
      <CaseStudy product={lead} />
      <ul className="products">
        {rest.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </ul>
    </section>
  );
}
