import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service'
import { User } from "./models/user";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'Musify';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(
    private _userService:UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);

  }

  public onSubmit() {
    console.log(this.user);

    this._userService.signup(this.user).subscribe(
      response => {

        this.identity = response.user;

        if(!this.identity._id){
          alert("el usuario no esta correctamente identificado");
        }else{
          //crear elemento en el localstorage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(this.identity));

          //conseguir el token para enviarlo en cada peticion http
          this._userService.signup(this.user, 'true').subscribe(
            response => {

              this.token = response.token;

              if(this.token.length <= 0){
                alert("el token no se ha generado correctamente");
              }else{
                //crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', this.token);

                console.log(this.token)
                console.log(this.identity);

              }

              console.log(response);

            },
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;

              }
            }
          );








        }

        console.log(response);

      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;

        }
      }
    );
  }
}
