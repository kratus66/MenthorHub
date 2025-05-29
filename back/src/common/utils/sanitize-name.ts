export function sanitizeName(name: string): string {
    return name
      .normalize('NFD') // elimina acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_') // espacios y símbolos
      .toLowerCase();
  }
  