import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoDto } from '../models/Todo';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  url = 'https://jsonplaceholder.typicode.com/todos/';
  count = 50;
  limit = `?_limit=${this.count}`;
  headers = new HttpHeaders(
    {'Content-Type': 'application/json; charset=UTF-8'}
  );

  logger: LoggerService;
  http: HttpClient;

  constructor(logger: LoggerService, http: HttpClient) {
    this.logger = logger;
    this.http = http;
  }

  getTodos(): Observable<HttpResponse<TodoDto[]>> {
    this.logger.log(`Requesting GET at '${this.url}${this.limit}'...`);

    return this.http.get<TodoDto[]>(`${this.url}${this.limit}`, {
      observe: 'response'
    });
  }

  queryTodo(): Observable<HttpResponse<TodoDto>> {
    this.logger.log(`Requesting POST at '${this.url}'...`);

    ++this.count;

    return this.http.get<TodoDto>(`${this.url}/${this.count}`, {
      headers: this.headers,
      observe: 'response'
    });
  }

  toggleTodo(todo: TodoDto): Observable<HttpResponse<object>> {
    this.logger.log(`Requesting PUT at '${this.url}/${todo.id}'...`);

    return this.http.put(`${this.url}/${todo.id}`, JSON.stringify(todo), {
      headers: this.headers,
      observe: 'response'
    });
  }

  deleteTodo(todo: TodoDto): Observable<HttpResponse<object>> {
    this.logger.log(`Requesting DELETE at '${this.url}/${todo.id}'...`);

    return this.http.delete(`${this.url}/${todo.id}`, {
      headers: this.headers,
      observe: 'response'
    });
  }
}
