import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service'
import { User } from './models/user';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'Musify';
  public user: User;
  public userRegister: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url;

  constructor(
    private _userService:UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.userRegister = new User('','','','','','ROLE_USER','');

  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

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
                this.user = new User('','','','','','ROLE_USER','');

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

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    //localStorage.clear();

    this.identity = null;
    this.token = null;
  }



  onSubmitRegister(){
    console.log(this.userRegister);

    this._userService.register(this.userRegister).subscribe(

      response => {
        let user = response.user;
        this.userRegister = user;

        if (!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.userRegister.email;
          this.userRegister =  new User('','','','','','ROLE_USER','');
        }

      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;

        }
      }




    );
  }
}
