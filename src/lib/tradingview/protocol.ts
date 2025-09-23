import JSZip from 'jszip';

const cleanerRgx = /~h~/g;
const splitterRgx = /~m~[0-9]{1,}~m~/g;

export function parseWSPacket(str: string): any[] {
  return str.replace(cleanerRgx, '').split(splitterRgx)
    .map((p) => {
      if (!p) return false;
      try {
        return JSON.parse(p);
      } catch (error) {
        console.warn('Cant parse', p);
        return false;
      }
    })
    .filter((p) => p);
}

export function formatWSPacket(packet: any): string {
  const msg = typeof packet === 'object' ? JSON.stringify(packet) : packet;
  return `~m~${msg.length}~m~${msg}`;
}

export async function parseCompressed(data: string): Promise<any> {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(data, { base64: true });
  const file = unzipped.file('');
  if (!file) {
    throw new Error('No file found in zip');
  }
  const text = await file.async('text');
  return JSON.parse(text);
}
