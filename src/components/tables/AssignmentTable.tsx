import { SearchOutlined, QuestionCircleOutlined  } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Input, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps, SorterResult } from 'antd/es/table/interface';
import { User } from '../../models/User';
import Highlighter from 'react-highlight-words';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../utils/useAxiosPrivate';
import { NoticeType } from 'antd/es/message/interface';
import { Team } from '../../models/Team';
import TeamService from '../../services/TeamService';
import AddTeamForm from '../forms/AddTeamForm';
import { Assignment } from '../../models/Assignment';

interface ChildProps {
    assignments: Assignment[];
    getData: () => void;
}




type DataIndex = keyof Assignment;

const AssignmentTable: React.FC<ChildProps> = ({assignments, getData}) => {


    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [sortedInfo, setSortedInfo] = useState<SorterResult<Team>>({});
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [team, setTeam] = useState<Team>();

      const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
      ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
      };

      const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Assignment> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  setSearchText((selectedKeys as string[])[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]!
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });


      
      const columns: ColumnsType<Assignment> = [
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: '40%',
          ...getColumnSearchProps('description'),
          ellipsis: true
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            width: '15%',
            //add sorting
            ellipsis: true
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
            width: '5%',
            //add sorting
            ellipsis: true
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            width: '5%',
            // add sorting
            ellipsis: true
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          width: '10%',
          render: (_, record) => (
            <Space size="middle">
              <Button onClick={() => handleUpdateAssignment(record)} type="primary">Update</Button>

              <Popconfirm
              title="Are you sure to delete this team?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
              onConfirm={() => handleDeleteAssignment(record)}
              >
                <Button type="primary" danger>Delete</Button>
              </Popconfirm>
             </Space>
          ),
        },
      ];

      


      const handleDeleteAssignment = async (assignment: Assignment) => {
        try {
          //const response = await TeamService.deleteTeam(axiosPrivate, teamName);

          giveMessage("success", "Team deleted");
          
          getData();
        } catch (error: any) {
          if (!error?.response) {
            giveMessage("error", "No server response");
          } else {
            giveMessage("error", "Login failed!");
          }
        }
      
      }

      const giveMessage = (type: NoticeType, mssge: string) => {
        message.open({
          type: type,
          content: mssge,
        });
      };

      const handleUpdateAssignment = (assignment: Assignment) => {
          setTeam(team);
          showModal();
      }

      
  
      

      const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    


    return (
        <>
            <Table columns={columns} dataSource={assignments} style={{ top: "0"}} scroll={{y: 200}} pagination={{hideOnSinglePage: true}}/>

            <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
              <AddTeamForm team={team} getData={getData} />
            </Modal>

        </>
    )
}


export default AssignmentTable;