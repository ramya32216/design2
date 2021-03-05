import { Component, OnInit } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-landingpagethree',
  templateUrl: './landingpagethree.component.html',
  styleUrls: ['./landingpagethree.component.scss']
})

export class LandingpagethreeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(".toggle-password").click(function() {
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });

    $('input[type=password]').keyup(function() {
      var password = $(this).val();      
      if ( password.length < 8 ) {
        $('#length').removeClass('valid').addClass('invalid');
      } else {
        $('#length').removeClass('invalid').addClass('valid');    
      }
      if ( password.match(/[a-z]/) ) {
        $('#small').removeClass('invalid').addClass('valid');
      } else {
        $('#small').removeClass('valid').addClass('invalid');
      }
      if ( password.match(/[A-Z]/) ) {
        $('#capital').removeClass('invalid').addClass('valid');
      } else {
        $('#capital').removeClass('valid').addClass('invalid');
      }
    }).focus(function() {
        $('#pswd_info').show();
    })
      .blur(function() {
          $('#pswd_info').hide();
    });
  }
}
