import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  imagenSeleccionadaSrc;
  imagenesPorEnviar:Array<any> = [];
  imagenesServidor:Array<any> = [];
  api = 'https://stageapi.hmsistemas.net/api.php';
  constructor(private http:HttpClient,private camera: Camera) {}

  public seleccionarImagen(src, type){
      this.imagenSeleccionadaSrc = src;
  }

  ngOnInit(){
    this.init();
  }

  async init(){
    await this.traerImagenesServidor();
  }

  traerImagenesServidor(){
    return new Promise((resolve)=>{
      this.http.get(`${this.api}?accion=traerImagenes`).subscribe((response:any)=>{
        this.imagenesServidor = response;
      })
    })
  }

  tomarFoto(){
    const options: CameraOptions = {
      quality: 5,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        const base64Image = imageData;
        this.imagenesPorEnviar.push(base64Image);
      },
      err => {
        alert('Por favor intenta tomar la fotografia de nuevo');
      }
    );
  }

  subirImagenesServidor(){
    
    if (this.imagenesPorEnviar.length < 1) {
      alert('Por favor agrega evidencias fotograficas para continuar');
    } else {
      console.log('enviando');
      const data = new FormData();

      this.imagenesPorEnviar.forEach(imagen => {
        data.append('anexos[]', imagen);
      });
      
      this.http.post(`${this.api}?accion=enviarImagenes`,data).subscribe((response:any)=>{
        console.log(response);
        if (response.status == 'success') {
          alert('Imagenes subidas con exito');
          this.imagenesPorEnviar = [];
          this.traerImagenesServidor().then();
        }
      })

    }   

  }



}
