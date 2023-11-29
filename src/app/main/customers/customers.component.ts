import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CustomerService } from 'app/common/services/customer.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomersComponent implements OnInit {

  public contentHeader: object;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public rows = [];
  private unsubscribleAll: Subject<any>;
  public page = {
    pageNumber: 0,
    size: 10,
    totalCount: undefined,
    search: null
  }
  @BlockUI() blockUI: NgBlockUI;

  constructor(private customerService: CustomerService) {
    this.unsubscribleAll = new Subject();
   }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Customers',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Customers',
            isLink: false
          },
        ]
      }
    }

    this.setPage({offset: 0});
  }

setPage(pageInfo): void {
  this.blockUI.start();
console.log('pageInfo',pageInfo);
this.page.pageNumber = pageInfo.offset;
this.customerService.getCustomers(this.page.search, this.page.pageNumber + 1, this.page.size).pipe(takeUntil(this.unsubscribleAll)).subscribe((response:any) => {
  console.log('response', response);
  const { data, page, totalCount } = response;
  this.rows = data;
  this.page.totalCount = totalCount;
  this.page.pageNumber = page - 1;
  this.blockUI.stop();
}, () => {
  this.blockUI.stop();
}
);

}

filterCustomers(event) 
{
  console.log(event.target.value);
  this.page.search = event.target.value;
  this.setPage({offset:0});
}

onDeleteCustomer(row) 
{
  console.log('row', row);
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7367F0',
    cancelButtonColor: '#E42728',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ml-1'
    }
  }).then((result) => {
    this.blockUI.start();
    this.customerService.deleteCustomer(row.id).pipe(takeUntil(this.unsubscribleAll)).subscribe(response => {
      this.setPage({offset: 0 });
      Swal.fire({
        title: 'Great!',
        text: 'Customer has been deleted.',
        icon: 'success',
        confirmButtonColor: '#7367F0',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      });
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }
    )
  });
}
}
