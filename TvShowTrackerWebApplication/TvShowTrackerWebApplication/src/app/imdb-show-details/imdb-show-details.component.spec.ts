import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbShowDetailsComponent } from './imdb-show-details.component';

describe('ImdbShowDetailsComponent', () => {
  let component: ImdbShowDetailsComponent;
  let fixture: ComponentFixture<ImdbShowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImdbShowDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImdbShowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
