import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import swal from 'sweetalert';


function Docket() {
    const [docket, setDocket] = useState([])

    const [values, setValues] = useState([])
    const [order, setOrder] = useState([]);
    const [description1, setDescription1] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);   

    const [docket_name, setDocket_name] = useState('')
    const [start_time, setStart_time] = useState('');
    const [end_time, setEnd_Time] = useState('');
    const [hours_worked, setHours_worked] = useState('');
    const [rate_per_hour, setRate_per_hour] = useState('')
    const [supplier, setSupplier] = useState('')
    const [purchase_order, setPurchase_order] = useState('')

    const getData = async () => {
        let response = await axios.get('http://localhost:7000/viewdocket', {
            withCredentials: true,
            credentials: 'include'
        })
        setDocket(response.data);
    }
    useEffect(() => {
        getData()
    }, [])

    const getData1 = async () => {
        let response = await axios.get('http://localhost:7000/viewsupplier', {
            withCredentials: true,
            credentials: 'include'
        })
        setValues(response.data);
    }
    useEffect(() => {
        getData1()
    }, [])

    function selectSup(e) {
        let sup = e.target.value;
        setSupplier(e.target.value)
        async function setPONumber() {
            let getPO = await axios.get(`http://localhost:7000/viewpurchaseorder/${sup}`);
            console.log(getPO.data)
            setOrder(getPO.data)
        }
        setPONumber()
    }

    function selectSup1(e) {
        let ponum = e.target.value;
        setPurchase_order(e.target.value)
        async function setDesc() {
            let getPO1 = await axios.get(`http://localhost:7000/viewdescription?po_number=${ponum}`);
            console.log(getPO1.data)
            setDescription1(getPO1.data)
        }
        setDesc()
    }
    async function handleSubmit() {
        await axios.post('http://localhost:7000/adddocket', { docket_name, start_time, end_time, hours_worked, rate_per_hour, supplier, purchase_order })
            .then(res => {
                getData()
                handleClose()
                swal({
                    title: 'Add Success!',
                    icon: "success",
                    button: "ok!",
                });

            }).catch(err => console.log(err));
    }
    
    return (
        <>
            <h3 style={{ textAlign: 'center', paddingTop: '10px' }}>Docket List</h3>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
            </div>

            <Button variant="primary" onClick={handleShow}
                style={{ marginRight: '90%' }}
            >
                Create New
            </Button>
            <div className='usersBox'>
                <div className='tables' style={{ marginTop: '30px' }}>
                    <Table>
                        <thead >
                            <tr>
                                <th>Docket Name</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Hours Worked</th>
                                <th>Rate Per Hour</th>
                                <th>Supplier</th>
                                <th>purchase Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                docket.map((data, i) => (
                                    <tr>
                                        <td>{data.docket_name}</td>
                                        <td>{data.start_time}</td>
                                        <td> {data.end_time}</td>
                                        <td>{data.hours_worked}</td>
                                        <td>{data.rate_per_hour}</td>
                                        <td>{data.supplier}</td>
                                        <td>{data.purchase_order}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add New Docket
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-1" controlId="formBasicEmail">
                        <Form.Label column sm="4">Docket Name</Form.Label>
                        <Form.Control type="text" placeholder="enter docket name"
                            value={docket_name} onChange={e => setDocket_name(e.target.value)}
                        />

                        <Form.Label column sm="4">Start Time</Form.Label>
                        <Form.Control type="time" placeholder="enter start time"
                            value={start_time} onChange={e => setStart_time(e.target.value)}
                        />


                        <Form.Label column sm="4">End Time</Form.Label>
                        <Form.Control type="time" placeholder="enter end time"
                            value={end_time} onChange={e => setEnd_Time(e.target.value)}
                        />
                        <Form.Label column sm="4">Hours Worked</Form.Label>
                        <Form.Control type="text" placeholder="enter hours worked"
                            value={hours_worked} onChange={e => setHours_worked(e.target.value)}
                        />
                        <Form.Label column sm="4">Rate Per Year</Form.Label>
                        <Form.Control type="text" placeholder="end rate per year"
                            value={rate_per_hour} onChange={e => setRate_per_hour(e.target.value)}
                        />
                        <Form.Label column sm="2">Supplier</Form.Label>
                        <Form.Select aria-label="Default select example"
                            onChange={(e) => selectSup(e)}
                            value={supplier}
                        >
                            {
                                values.map((opt, i) => <option value={opt.supplier}>{opt.supplier}</option>)
                            }
                        </Form.Select>

                        <Form.Label column sm="4">Purchase Order</Form.Label>
                        <Form.Select aria-label=""
                            onChange={(e) => selectSup1(e)}
                            value={purchase_order}
                        >
                            <option value = "" disabled>select po_number</option>
                            {
                                order.map((optt, i) => <option value={optt.po_number}>{optt.po_number}</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Label style={{ color: 'brown' }} column sm="4">{description1.map((remark) => <option value={remark.description}>{remark.description}</option>)}</Form.Label>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>



        </>
    )
}

export default Docket