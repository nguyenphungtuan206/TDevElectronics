/* Xuất báo cáo: .xlsx (Office Open XML) và .pdf (PDF 1.4, font nhúng, có tiếng Việt) – không cần thư viện ngoài. */
(function (root) {
  'use strict';
  const enc = new TextEncoder();
  const FONT = (typeof TDFONT !== 'undefined' && TDFONT) || (root && root.TDFONT) || null;

  /* ---------- tiện ích byte ---------- */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })();
  const crc32 = u8 => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 };
  const cat = parts => { let n = 0; parts.forEach(p => n += p.length); const o = new Uint8Array(n); let i = 0; parts.forEach(p => { o.set(p, i); i += p.length }); return o };
  const b64 = s => { if (typeof atob === 'function') { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u } return new Uint8Array(Buffer.from(s, 'base64')) };
  const le16 = n => [n & 255, (n >> 8) & 255], le32 = n => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];

  /* ---------- ZIP (không nén – hợp lệ cho .xlsx) ---------- */
  function zip(files) {
    const loc = [], cen = []; let off = 0;
    const d = new Date(), dt = ((d.getFullYear() - 1980) << 9 | (d.getMonth() + 1) << 5 | d.getDate()) & 0xFFFF, tm = (d.getHours() << 11 | d.getMinutes() << 5 | (d.getSeconds() >> 1)) & 0xFFFF;
    files.forEach(f => {
      const name = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(data);
      const h = new Uint8Array([0x50, 0x4B, 3, 4, ...le16(20), ...le16(0x0800), ...le16(0), ...le16(tm), ...le16(dt), ...le32(crc), ...le32(data.length), ...le32(data.length), ...le16(name.length), ...le16(0)]);
      loc.push(h, name, data);
      cen.push(new Uint8Array([0x50, 0x4B, 1, 2, ...le16(20), ...le16(20), ...le16(0x0800), ...le16(0), ...le16(tm), ...le16(dt), ...le32(crc), ...le32(data.length), ...le32(data.length), ...le16(name.length), ...le16(0), ...le16(0), ...le16(0), ...le16(0), ...le32(0), ...le32(off)]), name);
      off += h.length + name.length + data.length;
    });
    const cd = cat(cen), end = new Uint8Array([0x50, 0x4B, 5, 6, 0, 0, 0, 0, ...le16(files.length), ...le16(files.length), ...le32(cd.length), ...le32(off), 0, 0]);
    return cat([...loc, cd, end]);
  }

  /* ---------- XLSX ---------- */
  const xe = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  const colName = i => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - m) / 26) } return s };
  /* kiểu cột: s = chữ, n = số nguyên, c = tiền USD, p = số thập phân */
  function xlsx(o) {
    const head = o.head, rows = o.rows, types = o.types || head.map(() => 's'), sheet = (o.sheet || 'Sheet1').replace(/[\\\/\?\*\[\]:]/g, ' ').slice(0, 31) || 'Sheet1';
    const W = head.map((h, c) => { let w = String(h).length; rows.forEach(r => { const v = r[c]; const L = v == null ? 0 : String(v).length; if (L > w) w = L }); return Math.min(60, Math.max(10, Math.round(w * 1.15 + 2))) });
    const sx = { s: 3, n: 4, c: 5, p: 6 };
    let sd = '<row r="1" ht="22" customHeight="1">' + head.map((h, c) => `<c r="${colName(c)}1" s="1" t="inlineStr"><is><t>${xe(h)}</t></is></c>`).join('') + '</row>';
    rows.forEach((r, i) => {
      const n = i + 2;
      sd += `<row r="${n}">` + head.map((h, c) => {
        const v = r[c], ref = colName(c) + n, t = types[c] || 's';
        if (v == null || v === '') return `<c r="${ref}" s="${sx[t] || 3}"/>`;
        if (t !== 's' && typeof v === 'number' && isFinite(v)) return `<c r="${ref}" s="${sx[t]}"><v>${v}</v></c>`;
        return `<c r="${ref}" s="3" t="inlineStr"><is><t xml:space="preserve">${xe(v)}</t></is></c>`;
      }).join('') + '</row>';
    });
    const last = colName(head.length - 1) + (rows.length + 1);
    const sheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      `<dimension ref="A1:${last}"/><sheetViews><sheetView workbookViewId="0" showGridLines="1"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="16"/>` +
      '<cols>' + W.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('') + '</cols>' +
      `<sheetData>${sd}</sheetData><autoFilter ref="A1:${last}"/><pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="landscape" fitToHeight="0"/></worksheet>`;
    const styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<numFmts count="2"><numFmt numFmtId="164" formatCode="&quot;$&quot;#,##0.00"/><numFmt numFmtId="165" formatCode="#,##0.00"/></numFmts>' +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font></fonts>' +
      '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF3B5BFF"/><bgColor indexed="64"/></patternFill></fill></fills>' +
      '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD0D7E2"/></left><right style="thin"><color rgb="FFD0D7E2"/></right><top style="thin"><color rgb="FFD0D7E2"/></top><bottom style="thin"><color rgb="FFD0D7E2"/></bottom><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="7"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
      '<xf numFmtId="3" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>' +
      '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>' +
      '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf></cellXfs>' +
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
    const iso = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    return zip([
      { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>' },
      { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>' },
      { name: 'docProps/core.xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xe(o.title || sheet)}</dc:title><dc:creator>${xe(o.author || 'TDev')}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${iso}</dcterms:created></cp:coreProperties>` },
      { name: 'docProps/app.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>TDev Admin</Application></Properties>' },
      { name: 'xl/workbook.xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="${xe(sheet)}" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'${xe(sheet)}'!$A$1:$${colName(head.length - 1)}$${rows.length + 1}</definedName></definedNames></workbook>` },
      { name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { name: 'xl/styles.xml', data: styles },
      { name: 'xl/worksheets/sheet1.xml', data: sheetXml }
    ]);
  }

  /* ---------- PDF ---------- */
  const fmtNum = (v, t) => { if (typeof v !== 'number' || !isFinite(v)) return v; const f = (x, d) => x.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return t === 'c' ? (v < 0 ? '-$' : '$') + f(Math.abs(v), 2).replace(/^(\d)/, '$1') : t === 'p' ? f(v, 2) : f(v, 0) };
  function pdf(o) {
    if (!FONT) throw new Error('Thiếu font nhúng (js/export-font.js)');
    const head = o.head, types = o.types || head.map(() => 's'), rows = o.rows.map(r => r.map((v, c) => fmtNum(v, types[c])));
    const PW = 841.89, PH = 595.28, MX = 36, MT = 40, MB = 40, FS = 9, LH = 12, PAD = 5;
    const F = { r: FONT.r, b: FONT.b };
    /* văn bản -> glyph id (font subset: ký tự lạ thành "?") */
    const glyphs = (t, f) => { const m = F[f].map, out = []; for (const ch of String(t == null ? '' : t).replace(/[\r\n\t]+/g, ' ')) { const g = m[ch.codePointAt(0)] || m[63] || m[32]; out.push(g) } return out };
    const wid = (t, f, size) => glyphs(t, f).reduce((a, g) => a + g[1], 0) * size / 1000;
    /* cột: đo độ rộng nội dung, co giãn vừa khổ A4 ngang */
    const avail = PW - MX * 2, nat = head.map((h, c) => { let w = wid(h, 'b', FS); rows.forEach(r => { const x = wid(r[c], 'r', FS); if (x > w) w = x }); return Math.max(40, w + PAD * 2 + 2) });
    const sum = nat.reduce((a, b) => a + b, 0); let cw;
    if (sum <= avail) { const extra = (avail - sum) / head.length; cw = nat.map(w => w + extra) }
    else {
      /* cột ngắn giữ nguyên, cột dài chia phần còn lại theo tỉ lệ */
      const minW = nat.map(w => Math.min(w, 70)); let rest = avail - minW.reduce((a, b) => a + b, 0); const want = nat.map((w, i) => Math.max(0, w - minW[i])), wsum = want.reduce((a, b) => a + b, 0) || 1;
      cw = minW.map((m, i) => m + rest * want[i] / wsum);
    }
    const wrap = (t, w, f) => {
      const maxW = w - PAD * 2, lines = []; let cur = [];
      const flush = () => { lines.push(cur); cur = [] };
      String(t == null ? '' : t).split(/\n/).forEach((par, pi) => {
        if (pi) flush(); let line = [], lw = 0;
        par.split(/ +/).forEach(word => {
          const g = glyphs(word, f), ww = g.reduce((a, x) => a + x[1], 0) * FS / 1000, sp = F[f].map[32][1] * FS / 1000;
          if (line.length && lw + sp + ww <= maxW) { line.push([32, 0, 'sp'], ...g); lw += sp + ww; return }
          if (line.length) { cur.push(...line); flush(); line = []; lw = 0 }
          if (ww <= maxW) { line = [...g]; lw = ww; return }
          /* từ quá dài: cắt theo ký tự */
          let part = [], pw = 0; g.forEach(x => { const xw = x[1] * FS / 1000; if (pw + xw > maxW && part.length) { cur.push(...part); flush(); part = []; pw = 0 } part.push(x); pw += xw }); line = part; lw = pw;
        });
        cur.push(...line);
      });
      flush(); return lines.map(l => l.map(x => x[2] === 'sp' ? F[f].map[32] : x));
    };
    /* bố cục trang */
    const pages = [[]]; const titleH = 58, headRowH = 20;
    const hdrLines = head.map((h, i) => wrap(h, cw[i], 'b')), hH = Math.max(headRowH, Math.max(...hdrLines.map(l => l.length)) * LH + PAD * 2 - 2);
    let y = PH - MT - titleH, pg = pages[0];
    pg.push({ t: 'head', y: y - hH, h: hH }); y -= hH;
    rows.forEach((r, ri) => {
      const cells = r.map((v, c) => wrap(v, cw[c], 'r')), h = Math.max(LH + PAD * 2 - 2, Math.max(...cells.map(l => l.length)) * LH + PAD * 2 - 2);
      if (y - h < MB + 14) { pages.push([]); pg = pages[pages.length - 1]; y = PH - MT; pg.push({ t: 'head', y: y - hH, h: hH }); y -= hH }
      pg.push({ t: 'row', y: y - h, h, cells, i: ri }); y -= h;
    });
    /* nội dung từng trang */
    const hex = g => g.map(x => ('0000' + x[0].toString(16)).slice(-4)).join('');
    const txt = (f, size, x, yy, g) => g.length ? `BT /${f === 'b' ? 'F2' : 'F1'} ${size} Tf ${x.toFixed(2)} ${yy.toFixed(2)} Td <${hex(g)}> Tj ET\n` : '';
    const rgb = (r, g, b) => `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`;
    const xs = [MX]; cw.forEach(w => xs.push(xs[xs.length - 1] + w));
    const total = pages.length, streams = pages.map((pgi, pn) => {
      let s = '';
      if (pn === 0) {
        s += `${rgb(59, 91, 255)} rg ${MX} ${PH - MT - 4} ${avail} 3 re f\n`;
        s += `${rgb(15, 23, 42)} rg\n` + txt('b', 18, MX, PH - MT - 28, glyphs(o.title || '', 'b'));
        s += `${rgb(100, 116, 139)} rg\n` + txt('r', 9, MX, PH - MT - 44, glyphs(o.subtitle || '', 'r'));
      }
      pgi.forEach(it => {
        if (it.t === 'head') {
          s += `${rgb(59, 91, 255)} rg ${MX} ${it.y.toFixed(2)} ${avail} ${it.h.toFixed(2)} re f\n${rgb(255, 255, 255)} rg\n`;
          hdrLines.forEach((ls, c) => ls.forEach((l, li) => { const w = l.reduce((a, g) => a + g[1], 0) * FS / 1000; s += txt('b', FS, types[c] !== 's' ? xs[c] + cw[c] - PAD - w : xs[c] + PAD, it.y + it.h - PAD - 8 - li * LH + 1, l) }));
        } else {
          if (it.i % 2) s += `${rgb(244, 247, 252)} rg ${MX} ${it.y.toFixed(2)} ${avail} ${it.h.toFixed(2)} re f\n`;
          s += `${rgb(15, 23, 42)} rg\n`;
          it.cells.forEach((ls, c) => ls.forEach((l, li) => {
            const w = l.reduce((a, g) => a + g[1], 0) * FS / 1000, right = types[c] !== 's', x = right ? xs[c] + cw[c] - PAD - w : xs[c] + PAD;
            s += txt('r', FS, x, it.y + it.h - PAD - 8 - li * LH + 1, l);
          }));
          s += `${rgb(220, 226, 236)} RG 0.5 w ${MX} ${it.y.toFixed(2)} m ${MX + avail} ${it.y.toFixed(2)} l S\n`;
        }
      });
      const foot = `${o.footer || ''}`, pn1 = `${o.pageLabel || 'Page'} ${pn + 1} / ${total}`;
      s += `${rgb(100, 116, 139)} rg\n` + txt('r', 8, MX, 22, glyphs(foot, 'r')) + txt('r', 8, PW - MX - wid(pn1, 'r', 8), 22, glyphs(pn1, 'r'));
      return s;
    });
    /* ghép đối tượng PDF */
    const objs = []; const add = c => { objs.push(c); return objs.length }; /* id = index+1 */
    const bin = (dict, data) => cat([enc.encode(`<< ${dict} /Length ${data.length} >>\nstream\n`), data, enc.encode('\nendstream')]);
    /* 1 catalog, 2 pages, 3 F1 type0, 4 F1 cid, 5 F1 desc, 6 F1 file, 7 F1 tounicode, 8..12 tương tự cho F2 */
    const fontObjs = (key, base) => {
      const f = F[key], used = Object.keys(f.map).map(Number).sort((a, b) => a - b), ttf = b64(f.ttf);
      let cm = '/CIDInit /ProcSet findresource begin 12 dict begin begincmap /CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def /CMapName /Adobe-Identity-UCS def /CMapType 2 def 1 begincodespacerange <0000> <FFFF> endcodespacerange\n';
      const pairs = used.filter(cp => cp <= 0xFFFF).map(cp => [f.map[cp][0], cp]);
      for (let i = 0; i < pairs.length; i += 100) { const ch = pairs.slice(i, i + 100); cm += `${ch.length} beginbfchar\n` + ch.map(p => `<${('0000' + p[0].toString(16)).slice(-4)}> <${('0000' + p[1].toString(16)).slice(-4)}>`).join('\n') + '\nendbfchar\n' }
      cm += 'endcmap CMapName currentdict /CMap defineresource pop end end';
      const gw = new Map(); used.forEach(cp => gw.set(f.map[cp][0], f.map[cp][1])); gw.set(0, f.notdef);
      const gl = [...gw.keys()].sort((a, b) => a - b), W = gl.map(g => `${g} [${gw.get(g)}]`).join(' ');
      return {
        type0: `<< /Type /Font /Subtype /Type0 /BaseFont /${base} /Encoding /Identity-H /DescendantFonts [@CID] /ToUnicode @TU >>`,
        cid: `<< /Type /Font /Subtype /CIDFontType2 /BaseFont /${base} /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor @FD /DW ${f.notdef} /W [${W}] /CIDToGIDMap /Identity >>`,
        desc: `<< /Type /FontDescriptor /FontName /${base} /Flags 4 /FontBBox [${f.bbox.join(' ')}] /ItalicAngle 0 /Ascent ${f.asc} /Descent ${f.desc} /CapHeight ${f.cap} /StemV ${key === 'b' ? 140 : 80} /FontFile2 @FF >>`,
        file: bin(`/Length1 ${ttf.length}`, ttf), tu: bin('', enc.encode(cm))
      };
    };
    const S = [];
    const id = { cat: 1, pages: 2 }; let n = 2;
    const reserve = () => ++n;
    const fids = ['r', 'b'].map(k => ({ t0: reserve(), cid: reserve(), fd: reserve(), ff: reserve(), tu: reserve() }));
    const pageIds = pages.map(() => ({ p: reserve(), c: reserve() }));
    const out = []; const offs = []; let pos = 0;
    const put = (num, body) => { offs[num] = pos; const b = typeof body === 'string' ? enc.encode(`${num} 0 obj\n${body}\nendobj\n`) : cat([enc.encode(`${num} 0 obj\n`), body, enc.encode('\nendobj\n')]); out.push(b); pos += b.length };
    const hdr = cat([enc.encode('%PDF-1.4\n%'), new Uint8Array([0xE2, 0xE3, 0xCF, 0xD3]), enc.encode('\n')]); out.push(hdr); pos += hdr.length;
    put(1, `<< /Type /Catalog /Pages 2 0 R /Lang (vi) /ViewerPreferences << /DisplayDocTitle true >> >>`);
    put(2, `<< /Type /Pages /Kids [${pageIds.map(p => p.p + ' 0 R').join(' ')}] /Count ${pages.length} >>`);
    ['r', 'b'].forEach((k, i) => {
      const fo = fontObjs(k, k === 'b' ? 'AAAAAA+DejaVuSansCondensed-Bold' : 'BBBBBB+DejaVuSansCondensed'), d = fids[i], sub = s => s.replace('@CID', d.cid + ' 0 R').replace('@TU', d.tu + ' 0 R').replace('@FD', d.fd + ' 0 R').replace('@FF', d.ff + ' 0 R');
      put(d.t0, sub(fo.type0)); put(d.cid, sub(fo.cid)); put(d.fd, sub(fo.desc)); put(d.ff, fo.file); put(d.tu, fo.tu);
    });
    pages.forEach((p, i) => {
      const st = enc.encode(streams[i]);
      put(pageIds[i].p, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /Font << /F1 ${fids[0].t0} 0 R /F2 ${fids[1].t0} 0 R >> >> /Contents ${pageIds[i].c} 0 R >>`);
      put(pageIds[i].c, bin('', st));
    });
    const info = ++n; put(info, `<< /Title <FEFF${[...(o.title || 'Report')].map(ch => ('0000' + ch.charCodeAt(0).toString(16)).slice(-4)).join('')}> /Producer (TDev Admin) /CreationDate (D:${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}Z) >>`);
    const xref = pos; let x = `xref\n0 ${n + 1}\n0000000000 65535 f \n`; for (let i = 1; i <= n; i++) x += ('0000000000' + offs[i]).slice(-10) + ' 00000 n \n';
    out.push(enc.encode(x + `trailer\n<< /Size ${n + 1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
    return cat(out);
  }

  function download(bytes, name, mime) {
    const url = URL.createObjectURL(new Blob([bytes], { type: mime })), a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  const api = { xlsx, pdf, download, zip, crc32 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TDExport = api;
})(typeof window !== 'undefined' ? window : globalThis);
