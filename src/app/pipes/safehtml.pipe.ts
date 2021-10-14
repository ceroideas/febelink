import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Creé este Pipe porque cuando traía
 * html de i18n, me eliminaba los atributos (e.g.: el id)
 *
 * @author abdias
 * @version 0.0.1
 *
 * @interface
 */

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}