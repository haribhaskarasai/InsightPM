import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoleGuard } from '../guards/role.guard';

@Directive({
  selector: '[appUserRole]'
})
export class UserRoleDirective {

  constructor(private roleGuard: RoleGuard,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private router: Router) { }


  @Input()
  set appUserRole(roleFunction: any) {
    let hasAccess = false;

    if (roleFunction) {
      hasAccess = this.roleGuard.hasFunction(roleFunction);
    }

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
      this.router.navigateByUrl('/effortbook')
    }

  }

}
