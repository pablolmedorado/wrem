import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'tinymce',
  templateUrl: './tinymce.component.html',
  styleUrls: ['./tinymce.component.css']
})
export class TinymceComponent implements AfterViewInit, OnDestroy {
  @Input() elementId: String;
  @Input() content: String;
  @Output() onEditorKeyup = new EventEmitter<any>();

  private editor: any;
  staticUrl = environment.staticUrl;

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: 'link paste table lists advlist autolink preview wordcount contextmenu textcolor colorpicker help',
      toolbar: `undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | 
        bullist numlist outdent indent | link`,
      skin_url: `${this.staticUrl}/assets/skins/lightgray`,
      branding: false,
      height : 300,
      browser_spellcheck: true,
      //language: 'es',
      setup: editor => {
        this.editor = editor;
        editor.on('init', () => {
          editor.setContent(this.content);
        });
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
