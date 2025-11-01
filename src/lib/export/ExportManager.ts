/**
 * Export Manager - Export data to various formats
 */

export class ExportManager {
  /**
   * Export data to CSV
   */
  static toCSV(data: any[], filename: string = 'export.csv'): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle values with commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ),
    ].join('\n');

    this.downloadFile(csvContent, filename, 'text/csv');
  }

  /**
   * Export data to JSON
   */
  static toJSON(data: any, filename: string = 'export.json'): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, filename, 'application/json');
  }

  /**
   * Export table to Excel-compatible format (XML)
   */
  static toExcel(data: any[], filename: string = 'export.xlsx'): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    
    let xml = '<?xml version="1.0"?>\n';
    xml += '<?mso-application progid="Excel.Sheet"?>\n';
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
    xml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
    xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
    xml += '<Worksheet ss:Name="Sheet1">\n';
    xml += '<Table>\n';

    // Header row
    xml += '<Row>\n';
    headers.forEach(header => {
      xml += `<Cell><Data ss:Type="String">${this.escapeXml(header)}</Data></Cell>\n`;
    });
    xml += '</Row>\n';

    // Data rows
    data.forEach(row => {
      xml += '<Row>\n';
      headers.forEach(header => {
        const value = row[header];
        const type = typeof value === 'number' ? 'Number' : 'String';
        xml += `<Cell><Data ss:Type="${type}">${this.escapeXml(String(value))}</Data></Cell>\n`;
      });
      xml += '</Row>\n';
    });

    xml += '</Table>\n';
    xml += '</Worksheet>\n';
    xml += '</Workbook>\n';

    this.downloadFile(xml, filename, 'application/vnd.ms-excel');
  }

  /**
   * Export chart as SVG
   */
  static toSVG(svgElement: SVGElement, filename: string = 'chart.svg'): void {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    this.downloadFile(svgString, filename, 'image/svg+xml');
  }

  /**
   * Export chart as PNG
   */
  static async toPNG(svgElement: SVGElement, filename: string = 'chart.png'): Promise<void> {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = '#1f2937'; // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
      
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  /**
   * Print current page/section
   */
  static print(): void {
    window.print();
  }

  /**
   * Helper: Download file
   */
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Helper: Escape XML special characters
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

