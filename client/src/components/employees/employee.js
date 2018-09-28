import React, { Component } from 'react';
import './employee.css';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class Employee extends Component {
    _pageNo = 0;
    _pageSize = 10;
    _startAfter = -1;
    
    constructor() {
        super();
        this.state = {
            data: [],
            pages: 100
        }
    }

    fonPageSizeChange = (pageSize, pageNo, startAfter) => {
      this._pageNo=pageNo;
      this._pageSize=pageSize;
      this._startAfter = startAfter;
      this.getData();
    }

    fOnPageChange = (pageSize, pageNo, startAfter) => {
      this._pageNo=pageNo;
      this._startAfter = startAfter;
      this.getData();
    }

    getData = () => {
      fetch(`/abc/1.0/api/employees?start_after=${encodeURIComponent(this._startAfter)}&page_size=${encodeURIComponent(this._pageSize)}`)
        .then(res => res.json())
        .then(data => this.setState({data}, () => console.log('Employee fetched...',
        data)));
    }

    componentDidMount() {
      this.getData();
    }

    reloadApp(e) {
        window.location.reload(true);
        e.preventDefault();
    }

    render() {
        return (
          <div>
            <ReactTable
              data={this.state.data}
              pageNo={this._pageNo}
              pageSize={this._pageSize}
              pages={this.state.pages}
              columns={[
                {
                  Header: "Full Name",
                  columns: [
                    {
                      Header: "First Name",
                      accessor: "first_name"
                    },
                    {
                      Header: "Last Name",
                      accessor: "last_name"
                    }
                  ]
                },
                {
                    Header: "Title",
                    accessor: "title"
                },
                {
                    Header: "Location",
                    accessor: "location.name"
                },
                {
                    Header: "Department", 
                    accessor: "department.name"
                },
                {
                    Header: "Manager",
                    columns: [
                        {
                          Header: "First Name",
                          accessor: "manager.first_name"
                        },
                        {
                          Header: "Last Name",
                          accessor: "manager.last_name"
                        }
                      ]
                },
                {
                    Header: "Salary",
                    accessor: "employments.annual_salary"
                },
                {
                    Header: "Work Email",
                    accessor: "work_email"
                }
              ]}
              defaultSorted={[
                {
                  id: "id",
                }
              ]}
              className="-striped -highlight"
              
              onPageChange={(pageIndex) => {
                if(this.state.data.length>0){
                  this._startAfter = this.state.data[this.state.data.length-1].id;
                }
                this.fOnPageChange(this._pageSize, pageIndex, this._startAfter)
                } 
              }

              onPageSizeChange={(pageSize, pageIndex) => {
                if(this.state.data.length>0){
                  this._startAfter = this.state.data[this.state.data.length-1].id;
                } 
                this.fonPageSizeChange(pageSize, pageIndex, this._startAfter)}}
            />
            <br />
          </div>
        );
      }
}

export default Employee;
