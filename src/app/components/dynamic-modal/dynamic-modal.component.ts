import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';

@Component({
  selector: 'dynamic-modal',
  templateUrl: 'dynamic-modal.component.html',
  styleUrls: ['dynamic-modal.component.scss'],
})
export class DynamicModalComponent implements OnInit, OnDestroy {
  constructor(private resolverFactory: ComponentFactoryResolver) {
  }

  @Input() title: string = '';
  @Input() body!: ComponentType<{}>;
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  @ViewChild('viewContainer', {read: ViewContainerRef, static: false}) viewContainer!: ViewContainerRef;

  ngOnInit(): void {
    console.log('Modal init');
  }

  closeMe() {
    this.closeMeEvent.emit();
  }
  confirm() {
    this.confirmEvent.emit();
  }

  ngOnDestroy(): void {
    console.log('Modal destroyed');
  }

  ngAfterViewInit() {
    const factory = this.resolverFactory.resolveComponentFactory(this.body as any);
    this.viewContainer.createComponent(factory);
  }
}