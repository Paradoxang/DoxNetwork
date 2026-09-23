/**
 * Documentos legales de la tienda. Una sola plantilla (pages/Legal.tsx) los
 * pinta con índice, anclas y resumen.
 *
 * TODO antes de operar en serio, con asesoría legal:
 *  · La Ley 1480 de 2011 (art. 50) pide publicar la identidad del vendedor en
 *    comercio electrónico (nombre o razón social, NIT, dirección, teléfono y
 *    correo) y la Ley 1581 de 2012 identificar al responsable del tratamiento
 *    de datos. Por decisión del dueño, hoy se identifica solo la marca y el
 *    canal de WhatsApp.
 *  · Confirmar tiempos, costos y transportadoras de envío (site.ts).
 */
import { comboTiers, site } from "./site";

export interface LegalSection {
  id: string;
  title: string;
  body: (string | string[])[];
  links?: { label: string; to: string }[];
}

export interface LegalDoc {
  slug: string;
  path: string;
  title: string;
  short: string;
  description: string;
  summary: string[];
  sections: LegalSection[];
}

export const legalUpdated = "17 de septiembre de 2026";

/** TODO: plazo real para reportar novedades de un envío al recibirlo. */
const reportHours = 48;

const contacto = `WhatsApp ${site.whatsappDisplay} (${site.hours})`;

const terminos: LegalDoc = {
  slug: "terminos",
  path: "/terminos",
  title: "Términos y condiciones",
  short: "Términos",
  description: `Condiciones de uso del sitio y de compra en ${site.name}.`,
  summary: [
    "El pedido se arma en el carrito y se confirma por WhatsApp: queda en firme cuando confirmamos disponibilidad y total y recibimos el pago.",
    "Vendemos productos digitales, perfumería, relojería, tecnología y vapes (solo mayores de 18 años). Cada ficha dice si un producto es original o réplica.",
    "Envíos, cambios, garantías y datos personales tienen su propia política, enlazada abajo.",
  ],
  sections: [
    {
      id: "aceptacion",
      title: "Aceptación",
      body: [
        `Estos términos regulan el uso de ${site.url.replace("https://", "")} y las compras que hagas en ${site.name}. Al navegar el sitio o enviarnos un pedido aceptas la versión publicada en ese momento.`,
      ],
    },
    {
      id: "contacto",
      title: "Quiénes somos y cómo contactarnos",
      body: [
        `${site.name} es una tienda en línea que atiende sus pedidos por WhatsApp. Para cualquier consulta, pedido, garantía o reclamo escríbenos por ${contacto}.`,
      ],
    },
    {
      id: "productos",
      title: "Qué vendemos",
      body: [
        [
          "Productos digitales: acceso a plataformas de streaming, música, inteligencia artificial y software, pines de cine y recargas.",
          "Productos físicos: perfumería, relojería y tecnología, con envío a toda Colombia.",
          "Vapes: productos para mayores de 18 años, en una sección con verificación de edad.",
          "Páginas web a la medida con Dox Designs, bajo cotización.",
        ],
      ],
    },
    {
      id: "pedidos",
      title: "Cómo se hace un pedido",
      body: [
        "Agregas productos al carrito y lo envías por WhatsApp. Ese mensaje es una solicitud: el carrito no reserva productos ni congela precios.",
        "Te respondemos con la disponibilidad, el valor total (incluido el envío cuando aplique) y los datos de pago. La compra queda en firme cuando confirmamos el pedido y recibimos el pago.",
        "Si después del pago un producto resulta no estar disponible, te ofrecemos una alternativa o te devolvemos el valor pagado por ese producto.",
      ],
    },
    {
      id: "precios",
      title: "Precios y pagos",
      body: [
        `Los precios están en pesos colombianos (COP) y pueden cambiar sin previo aviso; se respeta el precio confirmado en tu pedido. Medios de pago: ${site.payments.join(", ")}.`,
        comboTiers.length
          ? `Al combinar productos digitales distintos se aplica un descuento automático (${comboTiers.map((t) => `${t.pct}% con ${t.min}`).join(", ")} o más). No se acumula con los combos armados ni aplica a productos físicos.`
          : "Los combos armados tienen su precio rebajado frente a comprar cada producto por separado.",
        "No pedimos ni guardamos datos de tarjetas.",
      ],
    },
    {
      id: "digitales",
      title: "Productos digitales",
      body: [
        "Cada producto indica su tipo de acceso, su vigencia y cuántos dispositivos admite. Son de uso personal durante la vigencia contratada.",
        "Para conservar la garantía no cambies contraseñas, correos, perfiles ni planes de las cuentas entregadas, ni las compartas más allá de lo que incluye tu plan.",
        "Nada se renueva ni se cobra automáticamente: al vencer decides si renuevas.",
        `${site.name} no está afiliada ni patrocinada por las plataformas mencionadas.`,
      ],
    },
    {
      id: "fisicos",
      title: "Productos físicos",
      body: [
        "Las fotos son del proveedor y son ilustrativas: colores, empaques y accesorios pueden variar. Si un detalle es importante para ti, pregúntanos antes de pagar.",
        "La disponibilidad depende del inventario del proveedor y se confirma en cada pedido.",
      ],
      links: [{ label: "Política de envíos", to: "/envios" }],
    },
    {
      id: "replicas",
      title: "Originales, réplicas y marcas",
      body: [
        "Cada ficha indica si el producto es original o réplica. Las réplicas no son productos de las marcas mencionadas ni están asociadas a ellas; los nombres de marca se usan solo como referencia para identificar el producto.",
        "Las marcas, logos y nombres de terceros pertenecen a sus respectivos dueños.",
      ],
    },
    {
      id: "mayores-de-edad",
      title: "Productos para mayores de edad",
      body: [
        "Los vapes solo se venden a mayores de 18 años. Para verlos debes confirmar tu edad en el sitio y volver a confirmarla al hacer el pedido.",
        "Podemos pedir un documento de identidad antes de enviar y cancelar cualquier pedido si no se puede verificar la mayoría de edad.",
      ],
    },
    {
      id: "cambios",
      title: "Cambios, retracto y garantías",
      body: ["Las condiciones de garantía, derecho de retracto, devoluciones y reversión del pago están en su propia política."],
      links: [{ label: "Cambios, devoluciones y garantías", to: "/cambios-y-garantias" }],
    },
    {
      id: "propiedad",
      title: "Propiedad intelectual del sitio",
      body: [
        `El diseño, los textos, el logo DN, el personaje ASTRO y el código de este sitio pertenecen a ${site.name} y Dox Designs. No se pueden copiar ni usar sin autorización.`,
      ],
    },
    {
      id: "uso",
      title: "Uso del sitio y responsabilidad",
      body: [
        "Te comprometes a usar el sitio y los productos de forma lícita. No respondemos por el uso indebido de cuentas o productos por parte del comprador ni por interrupciones de las plataformas de terceros fuera de lo que cubre la garantía.",
        "Hacemos lo posible por mantener la información actualizada, pero pueden existir errores de digitación en nombres, fotos o precios; en ese caso te lo informamos antes de confirmar el pago.",
      ],
    },
    {
      id: "datos",
      title: "Datos personales",
      body: ["El tratamiento de tus datos se rige por la política de privacidad."],
      links: [{ label: "Política de privacidad", to: "/privacidad" }],
    },
    {
      id: "ley",
      title: "Cambios a estos términos y ley aplicable",
      body: [
        "Podemos actualizar estos términos; la fecha de la última actualización aparece arriba. Los pedidos confirmados se rigen por la versión vigente al momento de la compra.",
        "Estos términos se rigen por las leyes de la República de Colombia, en especial el Estatuto del Consumidor (Ley 1480 de 2011). Como consumidor también puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co).",
      ],
    },
  ],
};

const privacidad: LegalDoc = {
  slug: "privacidad",
  path: "/privacidad",
  title: "Política de privacidad y tratamiento de datos",
  short: "Privacidad",
  description: `Cómo ${site.name} recolecta, usa y protege tus datos personales.`,
  summary: [
    "El sitio no tiene registro, formularios, cookies de publicidad ni analítica. Tu carrito y tus favoritos se guardan solo en tu navegador.",
    "Los datos que nos das por WhatsApp (nombre, número, dirección, pago) se usan para gestionar tu pedido, el envío y el soporte. No los vendemos.",
    "Puedes conocer, actualizar, rectificar o pedir que eliminemos tus datos escribiéndonos por WhatsApp.",
  ],
  sections: [
    {
      id: "marco",
      title: "Alcance y marco legal",
      body: [
        `Esta política aplica a los datos personales que ${site.name} trata a través del sitio y de WhatsApp, conforme a la Ley 1581 de 2012 y sus decretos reglamentarios (Decreto 1074 de 2015).`,
      ],
    },
    {
      id: "datos",
      title: "Qué datos tratamos",
      body: [
        [
          "Datos de contacto: nombre, número de WhatsApp y los mensajes que nos envías.",
          "Datos del pedido: productos, valores, comprobantes de pago y número de pedido.",
          "Datos de envío: ciudad, dirección y, si la transportadora o la verificación de edad lo requieren, número de documento.",
          "Datos de activación: el correo electrónico al que se activa un producto digital, cuando el producto lo requiere.",
        ],
        "No pedimos contraseñas de tus cuentas personales ni datos de tarjetas, y no tratamos datos sensibles.",
      ],
    },
    {
      id: "navegador",
      title: "Lo que se guarda en tu navegador",
      body: [
        "El sitio no usa cookies de publicidad ni herramientas de analítica. Usa el almacenamiento local de tu navegador para recordar tu carrito, tus favoritos, el tema claro u oscuro, la confirmación de mayoría de edad y si ya viste un aviso promocional.",
        "Esa información se queda en tu dispositivo, no nos llega y puedes borrarla cuando quieras desde la configuración de tu navegador.",
      ],
    },
    {
      id: "finalidades",
      title: "Para qué usamos tus datos",
      body: [
        [
          "Gestionar tu pedido: confirmar disponibilidad, precio y pago.",
          "Entregar productos digitales y coordinar envíos de productos físicos.",
          "Darte soporte y atender garantías, cambios, peticiones, quejas y reclamos.",
          "Verificar la mayoría de edad en la compra de vapes.",
          "Avisarte sobre el vencimiento o la renovación de un producto que compraste.",
          "Cumplir obligaciones legales, contables y tributarias.",
        ],
        "Solo te enviaremos promociones si nos lo autorizas expresamente, y puedes pedir que dejemos de hacerlo en cualquier momento.",
      ],
    },
    {
      id: "autorizacion",
      title: "Autorización",
      body: [
        "Al escribirnos por WhatsApp y enviarnos un pedido nos autorizas a tratar tus datos para las finalidades descritas. Puedes revocar esa autorización cuando quieras, salvo en lo que sea necesario para cumplir una obligación legal o contractual pendiente.",
      ],
    },
    {
      id: "terceros",
      title: "Con quién los compartimos",
      body: [
        "No vendemos ni alquilamos tus datos. Solo los compartimos, en lo necesario, con:",
        [
          "Transportadoras, para entregar tus productos físicos.",
          "Proveedores de los productos, cuando se requiere para despachar o activar tu pedido.",
          "WhatsApp (Meta), el canal por el que nos comunicamos.",
          "Cloudflare, el servicio donde está alojado el sitio, que registra datos técnicos de las visitas (como la dirección IP) por seguridad.",
          "Meta (Facebook e Instagram), solo cuando llegas desde uno de nuestros anuncios: mide si la visita vino de esa campaña, con su propia política de datos.",
          "Autoridades, cuando una norma o una orden lo exija.",
        ],
        "Algunos de estos servicios guardan información fuera de Colombia, bajo sus propias políticas de protección de datos.",
      ],
    },
    {
      id: "derechos",
      title: "Tus derechos",
      body: [
        "Como titular de los datos puedes:",
        [
          "Conocer, actualizar y rectificar tus datos.",
          "Pedir prueba de la autorización que nos diste.",
          "Saber qué uso le hemos dado a tus datos.",
          "Revocar la autorización o pedir que eliminemos tus datos, cuando no exista un deber legal de conservarlos.",
          "Acceder gratis a tus datos.",
          "Presentar quejas ante la Superintendencia de Industria y Comercio.",
        ],
      ],
    },
    {
      id: "ejercer",
      title: "Cómo ejercer tus derechos",
      body: [
        `Escríbenos por ${contacto} indicando tu nombre, tu número de contacto y lo que solicitas. Respondemos las consultas en máximo diez (10) días hábiles y los reclamos en máximo quince (15) días hábiles, prorrogables en los términos de la ley si te informamos el motivo.`,
      ],
    },
    {
      id: "seguridad",
      title: "Seguridad y conservación",
      body: [
        "Tomamos medidas razonables para proteger tus datos contra acceso, uso o pérdida no autorizados. Los conservamos solo el tiempo necesario para las finalidades descritas y para cumplir obligaciones legales.",
      ],
    },
    {
      id: "menores",
      title: "Menores de edad",
      body: [
        "No vendemos vapes a menores de 18 años ni tratamos datos de menores para esa línea. Las compras de menores de edad deben hacerse con un adulto responsable.",
      ],
    },
    {
      id: "vigencia",
      title: "Cambios y vigencia",
      body: [
        `Esta política rige desde el ${legalUpdated}. Si la cambiamos de forma sustancial publicaremos la nueva versión en esta página con su fecha de actualización.`,
      ],
    },
  ],
};

const envios: LegalDoc = {
  slug: "envios",
  path: "/envios",
  title: "Envíos y entregas",
  short: "Envíos",
  description: `Cómo se entregan los productos digitales y cómo se envían los productos físicos de ${site.name}.`,
  summary: [
    `Lo digital llega por WhatsApp en unos ${site.deliveryMinutes} minutos en horario de atención.`,
    "Lo físico se envía a toda Colombia: el costo, la transportadora y el tiempo se confirman antes del pago.",
    `Revisa tu paquete al recibirlo y repórtanos cualquier novedad en las ${reportHours} horas siguientes.`,
  ],
  sections: [
    {
      id: "digitales",
      title: "Productos digitales",
      body: [
        `Se entregan por el mismo chat de WhatsApp en unos ${site.deliveryMinutes} minutos después de confirmar el pago, dentro del horario de atención (${site.hours}). Los pedidos pagados fuera de horario se entregan al inicio del siguiente horario.`,
        "Los productos que se activan en tu correo pueden tardar un poco más; te avisamos si es el caso.",
      ],
    },
    {
      id: "fisicos",
      title: "Productos físicos",
      body: [
        "Enviamos perfumería, relojería, tecnología y vapes a toda Colombia. Antes del pago te confirmamos el costo del envío, la transportadora y el tiempo estimado según tu ciudad.",
        "Cuando el pedido sale te compartimos la guía para que le hagas seguimiento. Los tiempos de entrega dependen de la transportadora y pueden variar en temporadas altas o zonas de difícil acceso.",
      ],
    },
    {
      id: "datos",
      title: "Datos de entrega",
      body: [
        "Es tu responsabilidad darnos una dirección y un número de contacto correctos. Si un envío se devuelve por datos errados o porque nadie lo recibe, el nuevo envío tiene costo.",
      ],
    },
    {
      id: "recibir",
      title: "Al recibir tu pedido",
      body: [
        `Revisa el paquete frente a la transportadora si es posible. Si llega abierto, golpeado, incompleto o con un producto distinto, repórtalo por WhatsApp en las ${reportHours} horas siguientes con fotos o un video del empaque y del producto.`,
      ],
      links: [{ label: "Cambios, devoluciones y garantías", to: "/cambios-y-garantias" }],
    },
    {
      id: "vapes",
      title: "Envíos de vapes",
      body: [
        "Solo se envían a mayores de 18 años. Podemos pedir un documento antes de despachar y la persona que recibe debe ser mayor de edad.",
      ],
    },
  ],
};

const cambios: LegalDoc = {
  slug: "cambios-y-garantias",
  path: "/cambios-y-garantias",
  title: "Cambios, devoluciones y garantías",
  short: "Garantías",
  description: `Garantía, derecho de retracto, devoluciones y reversión del pago en ${site.name}.`,
  summary: [
    `Productos digitales: si fallan durante la vigencia, los reponemos en menos de ${site.warrantyHours} horas.`,
    "Productos físicos: tienen garantía legal; te confirmamos su término por escrito al comprar.",
    "Tienes derecho de retracto de 5 días hábiles en compras a distancia, con las excepciones que fija la ley.",
  ],
  sections: [
    {
      id: "digitales",
      title: "Garantía de productos digitales",
      body: [
        `Si tu cuenta, perfil o código falla durante la vigencia contratada, repórtalo por WhatsApp con tu número de pedido y lo reponemos sin costo en menos de ${site.warrantyHours} horas dentro del horario de atención.`,
        "La garantía no cubre fallas causadas por cambios de contraseña, correo, perfil o plan hechos por el comprador, ni el uso en más dispositivos de los que incluye el plan.",
      ],
    },
    {
      id: "fisicos",
      title: "Garantía de productos físicos",
      body: [
        "Los productos físicos tienen la garantía legal que establece la Ley 1480 de 2011. Al confirmar tu compra te informamos por escrito el término de garantía de tu producto; si no se informa uno, aplica el que fija la ley.",
        "Para solicitarla escríbenos por WhatsApp con tu número de pedido, una descripción de la falla y fotos o un video. Según el caso y lo que establece la ley, se repara el producto, se cambia por otro igual o se devuelve el dinero.",
        [
          "No cubre daños por mal uso, golpes, caídas, humedad o manipulación del producto.",
          "No cubre el desgaste normal por uso.",
          "En las réplicas, la garantía cubre el funcionamiento del producto, no su autenticidad: la condición de réplica se informa antes de la compra.",
        ],
      ],
    },
    {
      id: "retracto",
      title: "Derecho de retracto",
      body: [
        "En compras a distancia puedes retractarte dentro de los cinco (5) días hábiles siguientes a la entrega del producto (artículo 47 de la Ley 1480 de 2011). Debes devolver el producto en las mismas condiciones en que lo recibiste, sin uso y con su empaque; los costos de transporte de la devolución corren por tu cuenta.",
        "Te devolvemos el dinero pagado dentro de los treinta (30) días calendario siguientes a tu solicitud.",
        "Según la ley, el retracto no aplica, entre otros casos, a:",
        [
          "Productos digitales ya entregados o activados, porque su prestación empezó con tu consentimiento.",
          "Bienes de uso personal, como perfumes, vapes y audífonos intraauriculares, una vez abiertos o usados.",
        ],
      ],
    },
    {
      id: "devoluciones",
      title: "Devoluciones por error o producto no disponible",
      body: [
        "Si te enviamos un producto distinto al que pediste, o llega incompleto o dañado y lo reportas a tiempo, asumimos el cambio y los envíos que genere.",
        "Si un producto no está disponible después de tu pago, te ofrecemos una alternativa o te devolvemos el valor pagado.",
      ],
      links: [{ label: "Política de envíos", to: "/envios" }],
    },
    {
      id: "reversion",
      title: "Reversión del pago",
      body: [
        "Si pagaste con un medio de pago electrónico y fuiste víctima de fraude, la operación no fue solicitada, el producto no se recibió, no corresponde a lo pedido o es defectuoso, puedes solicitar la reversión del pago (artículo 51 de la Ley 1480 de 2011). Debes hacerlo dentro de los cinco (5) días hábiles siguientes a que conociste la situación, presentando la queja ante nosotros y avisando a la entidad emisora del medio de pago.",
      ],
    },
    {
      id: "pqr",
      title: "Peticiones, quejas y reclamos",
      body: [
        `Escríbenos por ${contacto}. Si no quedas satisfecho con la respuesta, puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co).`,
      ],
    },
  ],
};

export const legalDocs: LegalDoc[] = [terminos, privacidad, envios, cambios];
export const legalBySlug = (slug: string) => legalDocs.find((d) => d.slug === slug);
