/*
 * Carta del Bar Restaurant Boina y Copa.
 * Se edita aquí, sin tocar el HTML.
 *
 * Cada plato:
 *   nombre        Texto tal cual en la carta.
 *   precio        Número (precio de la carta física de hace un año: orientativo).
 *   ingredientes  Lista. Vacía [] = "pendiente de confirmar con el bar".
 *   alergenos     Lista o null. null = pendiente de confirmar. No rellenar sin confirmación del bar.
 *   confirmado    true solo cuando el bar haya validado ingredientes y alérgenos.
 *                 Mientras sea false, los ingredientes salen como "según el nombre del plato".
 *
 * Los ingredientes que hay ahora salen solo de lo que dice el propio nombre del plato.
 */
window.CARTA = {
  categorias: [
    {
      id: 'tostas',
      titulo: 'Tostas',
      platos: [
        { nombre: 'Atún con piquillo',   precio: 7.40, ingredientes: ['Atún', 'Pimiento del piquillo'], alergenos: null, confirmado: false },
        { nombre: 'Jamón ibérico',       precio: 9.90, ingredientes: ['Jamón ibérico'], alergenos: null, confirmado: false },
        { nombre: 'Gulas al ajillo',     precio: 7.40, ingredientes: ['Gulas', 'Ajo'], alergenos: null, confirmado: false },
        { nombre: 'Bacon con huevos',    precio: 6.90, ingredientes: ['Bacon', 'Huevos'], alergenos: null, confirmado: false },
        { nombre: 'Morcilla con tomate', precio: 9.90, ingredientes: ['Morcilla', 'Tomate'], alergenos: null, confirmado: false },
        { nombre: 'Matrimonio',          precio: 9.90, ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'Anchoa con queso',    precio: 9.90, ingredientes: ['Anchoa', 'Queso'], alergenos: null, confirmado: false }
      ]
    },
    {
      id: 'bocadillos',
      titulo: 'Bocadillos',
      platos: [
        { nombre: 'Lomo con queso',                   precio: 7.00, ingredientes: ['Lomo', 'Queso'], alergenos: null, confirmado: false },
        { nombre: 'Bacon con queso',                  precio: 7.00, ingredientes: ['Bacon', 'Queso'], alergenos: null, confirmado: false },
        { nombre: 'Jamón serrano',                    precio: 5.00, ingredientes: ['Jamón serrano'], alergenos: null, confirmado: false },
        { nombre: 'Calamares',                        precio: 8.00, ingredientes: ['Calamares'], alergenos: null, confirmado: false },
        { nombre: 'Oreja con salsa brava',            precio: 8.00, ingredientes: ['Oreja', 'Salsa brava'], alergenos: null, confirmado: false },
        { nombre: 'Tortilla de patatas con pimiento', precio: 5.50, ingredientes: ['Tortilla de patatas', 'Pimiento'], alergenos: null, confirmado: false },
        { nombre: 'Boquerones en vinagre',            precio: 8.00, ingredientes: ['Boquerones', 'Vinagre'], alergenos: null, confirmado: false },
        { nombre: 'Tortilla francesa',                precio: 5.00, ingredientes: ['Tortilla francesa'], alergenos: null, confirmado: false }
      ]
    },
    {
      id: 'ensaladas',
      titulo: 'Ensaladas',
      platos: [
        { nombre: 'Mixta',                  precio: 8.50,  ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'César',                  precio: 10.50, ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'Boina',                  precio: 12.50, ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'Parrillada de verduras', precio: 12.50, ingredientes: ['Verduras a la parrilla'], alergenos: null, confirmado: false }
      ]
    },
    {
      id: 'sandwiches',
      titulo: 'Sándwiches',
      platos: [
        { nombre: 'Mixto',           precio: 3.50, ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'Mixto con huevo', precio: 4.00, ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'Vegetal',         precio: 4.50, ingredientes: [], alergenos: null, confirmado: false }
      ]
    },
    {
      id: 'hamburguesas',
      titulo: 'Hamburguesas',
      platos: [
        { nombre: 'Clásica',  precio: 7.50,  ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'Boina',    precio: 11.40, ingredientes: [], alergenos: null, confirmado: false },
        { nombre: 'De pollo', precio: 9.50,  ingredientes: ['Pollo'], alergenos: null, confirmado: false }
      ]
    },
    {
      id: 'meriendas',
      titulo: 'Meriendas',
      platos: [
        { nombre: 'Tortitas con nata',      precio: 3.50, ingredientes: ['Tortitas', 'Nata'], alergenos: null, confirmado: false },
        { nombre: 'Tostada Bimbo',          precio: 1.50, ingredientes: ['Pan Bimbo'], alergenos: null, confirmado: false },
        { nombre: 'Tostada con tomate',     precio: 2.00, ingredientes: ['Pan tostado', 'Tomate'], alergenos: null, confirmado: false },
        { nombre: 'Croissant a la plancha', precio: 1.50, ingredientes: ['Croissant'], alergenos: null, confirmado: false }
      ]
    }
  ],

  /*
   * Especial de la casa / de la semana.
   * No hay especiales reales todavía: esto es el hueco donde iría el plato del día.
   * Cuando el bar elija uno, poner pendiente: false y rellenar los campos.
   */
  especiales: [
    {
      titulo: 'Especial de la casa',
      nombre: 'Rabo de toro guisado',
      descripcion: 'Cocinado a fuego lento, con patatas fritas caseras.',
      precio: 14.50,
      pendiente: false
    }
  ]
};
