import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SideNavBarComponent } from '../views/side-nav-bar/side-nav-bar.component';
import { SidebarTemplate } from '../_models/sidebar-template';

@Injectable({
  providedIn: 'root'
})
export class SideNavbarService {
  templates: Array<SidebarTemplate> = [];
  // archived: Array<SidebarTemplate> = [];
  currentTemplate: BehaviorSubject<SidebarTemplate> = new BehaviorSubject(null);
  _sideBarComp: SideNavBarComponent;

  currentTemplate$ : Observable<SidebarTemplate> = this.currentTemplate.asObservable();

  linkClicked = new Subject<boolean>();

  onLinkClick() {
    this.linkClicked.next(true);
  }

  constructor() { }

  registerSideBarComponent(comp: SideNavBarComponent) {
    this._sideBarComp = comp;
  }

  AddTemplate(template: TemplateRef<any>, context: any, fromComponent: string) {
    // if (this.templates.length > 0) {
    // this.archived.push(this.templates[0]);
    // }
    this.templates.push(new SidebarTemplate(template, { $implicit: context }, fromComponent));
    // this.currentTemplate.next(this.templates)
     this.currentTemplate.next(this.templates[this.templates.length - 1]);
  }

  RemoveTemplate(fromComponent: string) {
   let index = this.templates.findIndex((templ) => { return templ.fromComponent === fromComponent })
    if (index > -1) this.templates.splice(index, 1);
    if (this.templates.length) this.currentTemplate.next(this.templates[this.templates.length - 1]);
    else this.currentTemplate.next(null);
    // if (this.archived.length > 0) this.templates.push(this.archived[0]);
  }
}
