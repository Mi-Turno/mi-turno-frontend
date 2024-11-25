import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [PortalModule,MatIcon],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit{


  @ViewChild(CdkPortal) portal: CdkPortal | undefined;
  @Output() cerrarModal = new EventEmitter<void>();
  @Input() modal:string = "modal";
  @Input() modalHeader:string = "modalHeader";
  @Input() modalContent:string = "modalContent";

  overlay = inject(Overlay);

  
  overlayConfig = new OverlayConfig({
    hasBackdrop: true,
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    scrollStrategy: this.overlay.scrollStrategies.block(),
    minWidth: '300px',
    minHeight: '300px'
  })

  overlayRef = this.overlay.create(this.overlayConfig);

  ngOnInit(): void {
    this.overlayRef.backdropClick().subscribe(()=>{
      this.cerrarModal.emit();
    })
  }

  ngAfterViewInit(): void {
    this.overlayRef?.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }




}
