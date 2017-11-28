import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
   constructor( private translate: TranslateService ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  switchLanguage (language: string) {
    this.translate.use(language);
  }
}
