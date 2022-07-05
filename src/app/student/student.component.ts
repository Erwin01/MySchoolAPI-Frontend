import { Component, OnInit, Pipe } from '@angular/core';
import { ConnectionService } from '../server/connection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as signalR from '@aspnet/signalr';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';



@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class StudentComponent implements OnInit {


  //hub
  private hubConnection: signalR.HubConnection;
  endpointHub = "https://localhost:44377/hubAlerts";

  studentForm: FormGroup;

  listStudent: any;

  btnSave: boolean = false;
  btnEdit: boolean = false;

  editId;

  message;

  constructor(private connectionService: ConnectionService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService ) { }
 
              
  ngOnInit(): void {
    this.ConnectionHub();
    this.getAll();
    this.FormInit();
  }


  FormInit()
  {
    this.studentForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      career: new FormControl('', Validators.required)
    });
  }


  cleanUp()
  {
    this.studentForm.reset({
      id: 0,
      name:'',
      firstName:'',
      lastName:'',
      phoneNumber:'',
      address: '',
      career: ''
    });
    this.btnSave = true,
    this.btnEdit = false
  }

  getAll()
  {
    this.connectionService.getAllStudents().subscribe(student => {
      this.listStudent = student;
      console.log(student);
    });
  }


  saveChanges()
  {
    let save = Object.assign({},this.studentForm.value)
    console.log(save);
    this.connectionService.createStudent(save).subscribe(student => {
      console.log(student);
      // if(student){
      //   this.getAll();
      //   this.messageService.add({severity:'success', summary: 'Created', detail: 'Student created'})
      // }
      // else{
      //   this.messageService.add({severity:'error', summary: 'Error', detail: 'Error'});
      // }
    })
  }


  confirmDelete(id: any,name: any,firstname: any,lastname: any,phonenumber: any,address: any,career: any) {
    this.confirmationService.confirm({
        header: "Delete",
        message: 'Do you want to delete the student with ID: '+id+' - '+name+' '+firstname+' '+lastname+'?',
        accept: () => {
          // this.messageService.add({severity:'error', summary: 'Confirmed', detail: 'Student deleted'});
          this.delete(id);
        },
        reject: () => {
          this.message = [{severity: 'info', summry: 'Rejected', detail: 'You have rejected'}]
        }
    });
  }



  delete(id:any)
  {
    this.connectionService.deleteStudent(id).subscribe( x => {
      console.log(x);
      
      // if(x){
      //   this.getAll();
      //   this.messageService.add({severity:'error', summary: 'Deleted', detail: 'Student deleted'})
      // }
      // else{
      //   this.messageService.add({severity:'Error', summary: 'Success', detail: 'Message Content'});
      // }
    });
  }


  viewEdit(id: any,name: any,firstname: any,lastname: any,phonenumber: any,address: any,career: any)
  {
    this.editId = id;
    this.studentForm.setValue({
      id: id,
      name: name,
      firstName: firstname,
      lastName: lastname,
      phoneNumber: phonenumber,
      address: address,
      career: career
    });
    this.btnSave = false,
    this.btnEdit = true
  }


  edit()
  {
    this.editId
    console.log(this.editId);
    let save = Object.assign({},this.studentForm.value)
    this.connectionService.editStudent(this.editId, save).subscribe( x => {
      console.log(x);
    });
  }



  ConnectionHub()
  {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.endpointHub)
    .build();

    this.hubConnection.on("GetAllData", () => {
      this.getAll();
    });

    this.hubConnection.on("StudentCreated", () => {
      this.getAll();
      this.messageService.add({severity:'success', summary: 'Created', detail: 'Student created'})
    });

    this.hubConnection.on("StudentDeleted", (studentId) => {
      this.getAll();
      this.messageService.add({severity:'error', summary: 'Deleted Id:' + studentId, detail: 'Student deleted'})
    });

    this.hubConnection.on("StudentUpdated", (studentId) => {
      this.getAll();
      this.messageService.add({severity:'success', summary: 'Updated Id:' + studentId, detail: 'Student updated'})
    });

    this.hubConnection
    .start()
    .then(() => console.log("Hub successsfully!"))
    .catch(() => console.log("Hub Bad!"))
  }



}



  

//https://fontawesome.com/v6/docs/web/use-with/angular
//https://getbootstrap.com/docs/5.0/forms/overview/
//https://fontawesome.com/icons/circle-plus?s=solid
//https://www.primefaces.org/primeng/toast