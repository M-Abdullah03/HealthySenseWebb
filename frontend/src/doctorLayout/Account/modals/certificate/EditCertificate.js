import { Avatar, Button, Container, FormControl, InputLabel, Modal, NativeSelect, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const EditCertificate = ({ DoctorData, setDoctorData, CertificateEditModal, CertificateEditModalClose, setChanges, CertificateIndex, setFiles }) => {
    const [Certificates, setCertificates] = useImmer({
        name: "",
        description: "",
        issueDate: "",
        expiryDate: "",
        approvedStatus: false,
        file: "",
    });
    const [CertificateFile, setCertificateFile] = useState(null);

    const HandleCertificateEditChange = async () => {
        if (Certificates.name.trim() === "" || Certificates.description.trim() === "" || Certificates.issueDate === "" || Certificates.expiryDate === "" || Certificates.file === "") {
            alert("Please fill all the fields");
            return;
        }
        const CheckIssueDate = Certificates.issueDate.split("-");
        const CheckExpiryDate = Certificates.expiryDate.split("-");
        if (CheckIssueDate[0] > CheckExpiryDate[0]) {
            alert("Issue Date cannot be greater than Expiry Date");
            return;
        }
        else if (CheckIssueDate[0] === CheckExpiryDate[0]) {
            if (CheckIssueDate[1] > CheckExpiryDate[1]) {
                alert("Issue Date cannot be greater than Expiry Date");
                return;
            }
            else if (CheckIssueDate[1] === CheckExpiryDate[1]) {
                if (CheckIssueDate[2] >= CheckExpiryDate[2]) {
                    alert("Issue Date cannot be greater than or Equal to Expiry Date");
                    return;
                }
            }
        }
        if (CertificateFile !== null) {
            setFiles(draft => {
                draft.push(
                    {
                        name: DoctorData.certificates[CertificateIndex]._id,
                        newFile: false,
                        file: CertificateFile,
                    }
                )
            })
        }
        setDoctorData(draft => {
            draft.certificates[CertificateIndex].name = Certificates.name;
            draft.certificates[CertificateIndex].description = Certificates.description;
            draft.certificates[CertificateIndex].issueDate = Certificates.issueDate;
            draft.certificates[CertificateIndex].expiryDate = Certificates.expiryDate;
            draft.certificates[CertificateIndex].approvedStatus = Certificates.approvedStatus;
            draft.certificates[CertificateIndex].file = Certificates.file;
        })
        if (CertificateFile !== null) {
        }

        setCertificates(draft => {
            draft.name = "";
            draft.description = "";
            draft.issueDate = "";
            draft.expiryDate = "";
            draft.approvedStatus = false;
            draft.file = null;
        })
        setChanges(true);
        CertificateEditModalClose();
    }

    useEffect(() => {
        if (CertificateIndex !== -1) {
            setCertificates(draft => {
                draft.name = DoctorData.certificates[CertificateIndex].name;
                draft.description = DoctorData.certificates[CertificateIndex].description;
                draft.issueDate = DoctorData.certificates[CertificateIndex].issueDate;
                draft.expiryDate = DoctorData.certificates[CertificateIndex].expiryDate;
                draft.approvedStatus = DoctorData.certificates[CertificateIndex].approvedStatus;
                draft.file = DoctorData.certificates[CertificateIndex].file;
            });
            setCertificates(draft => {
                draft.issueDate = draft.issueDate.slice(0, 10);
                draft.expiryDate = draft.expiryDate.slice(0, 10);
            });
        }
    }, [CertificateIndex]);

    return (
        <Modal
            open={CertificateEditModal}
            onClose={CertificateEditModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container className='model-container' style={{ width: 'fit-content' }}>
                <Typography variant="h4" style={{textAlign:'center', marginBottom:'20px'}}>Edit Certificate</Typography>
                <TextField id="outlined-basic" label="Name" variant="outlined"
                    style={{ width: '100%', minWidth: '350px', marginBottom: '20px' }}
                    value={Certificates.name}
                    onChange={(e) => {
                        setCertificates(draft => {
                            draft.name = e.target.value;
                        })
                    }} />
                <TextField id="outlined-basic" label="Description" variant="outlined"
                    style={{ width: '100%', minWidth: '350px', marginBottom: '20px' }}
                    value={Certificates.description}
                    onChange={(e) => {
                        setCertificates(draft => {
                            draft.description = e.target.value;
                        })
                    }
                    } />
                <div className="row-display" style={{ gap: '30px', marginBottom: '20px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Issue Date"
                            value={dayjs(Certificates.issueDate)}
                            onChange={(newValue) => {
                                const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
                                setCertificates(draft => {
                                    draft.issueDate = formattedDate;
                                })
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Expiry Date"
                            value={dayjs(Certificates.expiryDate)}
                            onChange={(newValue) => {
                                const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
                                setCertificates(draft => {
                                    draft.expiryDate = formattedDate;
                                })
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                </div>
                <div className="row-display">
                    <input type="file"
                        accept=".pdf"  
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            setCertificates(draft => {
                                draft.file = e.target.files[0].name;
                                draft.file = draft.file.replace(/\s/g, '');
                            })
                            setCertificateFile(e.target.files[0]);
                        }}
                        id="certificateInput"
                    />
                    <label htmlFor="certificateInput"
                        style={{ display: 'flex', flexDirection: 'row', gap: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                        <Typography variant="contained" style={{ backgroundColor: '#3f51b5', color: 'white' }} component="span">
                            Upload Certificate
                        </Typography>
                    </label>
                    {
                        Certificates.file !== "" ? <Typography>{Certificates.file}</Typography> : null
                    }
                </div>
                <Container style={{ display: 'flex', justifyContent: 'end', paddingRight: '0px' }}>
                    <Button variant="contained"
                        style={{ backgroundColor: '#3f51b5', color: 'white', marginTop: '10px' }}
                        onClick={() => { HandleCertificateEditChange() }}
                    >
                        Edit Certificate
                    </Button>
                </Container>
            </Container>
        </Modal>
    );
}

export default EditCertificate;