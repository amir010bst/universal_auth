import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycloakAuthComponent } from './keycloak-auth.component';

describe('KeycloakAuthComponent', () => {
  let component: KeycloakAuthComponent;
  let fixture: ComponentFixture<KeycloakAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeycloakAuthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KeycloakAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
