import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const baseURL = "https://localhost:44377/api/";


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient) { }

  
  getAllStudents()
  {
    return this.http.get(baseURL + 'student')
  }


  createStudent(student:any)
  {
    return this.http.post(baseURL + 'student', student)
  }


  deleteStudent(studentId:any)
  {
    return this.http.delete(baseURL + 'student/Delete/', { params:{'id': studentId}})
  }


  editStudent(studentId:any, student:any)
  {
    let data = `${baseURL}student/${studentId}/`;
    return this.http.put( data, student)
  }
}
