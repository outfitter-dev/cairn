// :A: tldr CSV formatter for Magic Anchor outputs
import type { IFormatter, FormatterInput } from '../interfaces/unified-formatter.interface.js';
import type { SearchResult, MagicAnchor } from '@grepa/types';

export class CSVFormatter implements IFormatter {
  // :A: api format data as CSV
  format(input: FormatterInput): string {
    switch (input.type) {
      case 'search':
        return this.formatSearchResults(input.data);
      case 'list':
        return this.formatListResults(input.data);
      case 'parse':
        return this.formatParseResults(input.data);
      case 'markers':
        return this.formatMarkers(input.data);
      default:
        return this.formatDefault(input);
    }
  }

  // :A: api format search results as CSV
  private formatSearchResults(results: SearchResult[]): string {
    const headers = ['File', 'Line', 'Column', 'Markers', 'Prose'];
    const rows = [headers];

    for (const result of results) {
      const anchor = result.anchor;
      rows.push([
        this.escapeCsvField(anchor.file || ''),
        anchor.line.toString(),
        anchor.column.toString(),
        this.escapeCsvField(anchor.markers.join(', ')),
        this.escapeCsvField(anchor.prose || '')
      ]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  // :A: api format list results as CSV
  private formatListResults(results: SearchResult[]): string {
    // :A: ctx same format as search results
    return this.formatSearchResults(results);
  }

  // :A: api format parse results as CSV
  private formatParseResults(data: { file: string; result: { anchors: MagicAnchor[]; errors: any[] } }): string {
    const headers = ['File', 'Line', 'Column', 'Markers', 'Prose', 'Status'];
    const rows = [headers];

    // :A: ctx add anchors
    for (const anchor of data.result.anchors) {
      rows.push([
        this.escapeCsvField(data.file),
        anchor.line.toString(),
        anchor.column.toString(),
        this.escapeCsvField(anchor.markers.join(', ')),
        this.escapeCsvField(anchor.prose || ''),
        'OK'
      ]);
    }

    // :A: ctx add errors
    for (const error of data.result.errors) {
      rows.push([
        this.escapeCsvField(data.file),
        error.line?.toString() || '',
        error.column?.toString() || '',
        '',
        this.escapeCsvField(error.message),
        'ERROR'
      ]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  // :A: api format unique markers as CSV
  private formatMarkers(markers: string[]): string {
    const headers = ['Marker'];
    const rows = [headers];

    for (const marker of markers) {
      rows.push([this.escapeCsvField(marker)]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  // :A: api format default output
  private formatDefault(input: FormatterInput): string {
    const headers = ['Type', 'Data'];
    const rows = [headers, [input.type, JSON.stringify(input.data)]];
    return rows.map(row => row.join(',')).join('\n');
  }

  // :A: api escape CSV field values
  private escapeCsvField(field: string): string {
    // :A: ctx if field contains comma, quotes, or newline, wrap in quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      // :A: ctx escape quotes by doubling them
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
}