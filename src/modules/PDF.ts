import { create, CreateOptions } from 'html-pdf';

export const pdfFromHtml = (html: string) => {
    const options: CreateOptions = {
        type: 'pdf',
        format: 'A4',
        orientation: 'portrait'
    }

    return create(html, options).toBuffer((err, buffer) => {
        if (err) return err;
        return buffer;
    });
}
