import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoDto } from 'src/app/models/Todo';
import { LoggerService } from 'src/app/services/logger.service';
import { TodosService } from 'src/app/services/todos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserDto } from 'src/app/models/UserDto';
import { UserService } from 'src/app/services/user.service';
import { combineLatest, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'assignee', 'status', 'actions'];
  dataSource: MatTableDataSource<TodoDto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  todos$: Observable<HttpResponse<TodoDto[]>> = this.todosService.getTodos();
  users$: Observable<HttpResponse<UserDto[]>> = this.userService.getUsers();

  constructor(
    private logger: LoggerService,
    private todosService: TodosService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    combineLatest([this.todos$, this.users$]).subscribe(([todos, users]) => {
      console.log(
        `Todos: ${todos},
           Users: ${users},
           `
      );
      todos.body.forEach((todo) => {
        todo.userName = users.body.find((user) => user.id === todo.userId).name;
      });
      this.dataSource = new MatTableDataSource(todos.body);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort=this.sort;
      this.logger.log('Request successful !');
    });
  }

  deleteTodo(todo: TodoDto): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.todosService.deleteTodo(todo).subscribe((response) => {
          if (response.ok) {
            const index = this.dataSource.data.indexOf(todo);
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
            this.logger.log('Request Delete successful !');
            Swal.fire(
              'Removed!',
              'Product removed successfully.',
              'success'
            )
          } else {
            this.logger.log(`Request failed: ${response.status}.`);
            Swal.fire(
              'Cancelled',
              'Product still in our database.)',
              'error'
            )
          }
        });
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Product still in our database.)',
          'error'
        )
      }
    })

    
  }
}
