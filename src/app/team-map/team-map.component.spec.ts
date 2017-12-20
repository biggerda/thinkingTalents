import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMapComponent } from './team-map.component';

describe('TeamMapComponent', () => {
  let component: TeamMapComponent;
  let fixture: ComponentFixture<TeamMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
