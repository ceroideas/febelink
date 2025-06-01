import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FooterComponent } from './footer.component'

describe('FooterComponent', () => {
    console.log("test ceroideas",'FooterComponent test - INIT')
    let component: FooterComponent
    let fixture: ComponentFixture<FooterComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FooterComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        console.log("test ceroideas",'FooterComponent - should create')
        expect(component).toBeTruthy()
    })
    console.log("test ceroideas",'FooterComponent test - STOP')
})
