import { Seo } from "@/components/Seo";
import { site } from "@/data/site";
import { Reveal } from "@/lib/anim";

/**
 * TODO: texto base de referencia. Revísalo (idealmente con asesoría legal)
 * y ajústalo a tus condiciones reales antes de publicar.
 */
const sections = [
  {
    t: "Qué vendemos",
    p: `${site.name} vende productos y servicios digitales, que se entregan por WhatsApp una vez confirmado el pago, y productos físicos (perfumería, relojería y tecnología), que se envían a la dirección que indiques.`,
  },
  // TODO: ajusta envíos y cambios de productos físicos a tus condiciones reales
  {
    t: "Envíos de productos físicos",
    p: "Enviamos a toda Colombia. El costo, la transportadora y el tiempo estimado se confirman por WhatsApp antes del pago según tu ciudad.",
  },
  {
    t: "Originales y réplicas",
    p: "Cada ficha indica si el producto es original o réplica. Las réplicas no son productos de las marcas mencionadas ni están asociadas a ellas; los nombres se usan solo como referencia.",
  },
  {
    t: "Pedidos y pagos",
    p: `El pedido se confirma por WhatsApp. Los precios están en pesos colombianos (COP) y pueden cambiar sin previo aviso. Medios de pago: ${site.payments.join(", ")}.`,
  },
  {
    t: "Vigencia y soporte",
    p: "Cada producto indica su duración. Durante la vigencia te damos soporte por WhatsApp si presentas algún inconveniente con tu compra.",
  },
  {
    t: "Garantía de reposición",
    p: `Si tu cuenta, perfil o código falla durante la vigencia contratada, repórtalo por WhatsApp con tu número de pedido. Lo reponemos sin costo en menos de ${site.warrantyHours} horas en horario de atención.`,
  },
  {
    t: "Sin renovaciones automáticas",
    p: "Ningún producto se renueva solo ni guardamos datos de pago. Al vencer, decides si renuevas.",
  },
  {
    t: "Cambios y devoluciones",
    p: "Productos digitales: una vez entregados no se admiten devoluciones, salvo que no funcionen y no podamos solucionarlo. Productos físicos: la garantía y las condiciones de cambio se confirman por escrito antes del pago según el producto.",
  },
  {
    t: "Datos personales",
    p: "Solo usamos tu número y los datos del pedido para gestionar la compra y darte soporte. No compartimos tu información con terceros.",
  },
];

export function Terms() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-[140px] md:px-6 md:pt-[164px]">
      <Seo title={`Términos y condiciones · ${site.name}`} description={`Condiciones de compra en ${site.name}.`} path="/terminos" />
      <Reveal>
        <p className="kicker">Legal</p>
        <h1 className="display mt-3 text-[clamp(32px,5vw,52px)]">Términos y condiciones</h1>
      </Reveal>
      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.04}>
            <h2 className="text-lg font-bold">{s.t}</h2>
            <p className="mt-2 leading-relaxed text-mute">{s.p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
