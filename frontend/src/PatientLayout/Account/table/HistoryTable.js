import { Button, Container, Typography, Table, TableBody, TableHead, TableRow, TableCell } from "@mui/material";
import React from "react";import {styled} from "@mui/system";


const CustomTableRow = styled(TableRow)(({}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    width: '100%',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
}));

const CustomTableCell = styled(TableCell)(({}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
    wordBreak: 'normal',
    overflowWrap: 'break-word',
    width: '100%',
    border:'none',
    gap:'10px'
}));

const PatientHistory = ({ PatientData, setPatientData, setIndex, HistoryEditModalOpen }) => {
    return (
        <Table>
            <TableHead>
                <CustomTableRow>
                    <CustomTableCell style={{fontWeight:'bold', fontSize:'16px', width:'25%'}}>Type</CustomTableCell>
                    <CustomTableCell style={{fontWeight:'bold', fontSize:'16px', width:'45%'}}>Description</CustomTableCell>
                    <CustomTableCell style={{ width:'30%'}}></CustomTableCell>
                </CustomTableRow>
            </TableHead>
            <TableBody>
            {
                PatientData.history.length > 0 ?
                    PatientData.history.map((history, index) => {
                        return (
                            <CustomTableRow>
                                <CustomTableCell>{history.type}</CustomTableCell>
                                <CustomTableCell>{history.description}</CustomTableCell>
                                <CustomTableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setIndex(index);
                                            HistoryEditModalOpen();
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setPatientData({
                                                ...PatientData,
                                                history: PatientData.history.filter((history, i) => i !== index)
                                            })
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </CustomTableCell>
                            </CustomTableRow>
                        )
                    })
                    :
                    <CustomTableRow>
                        <CustomTableCell colSpan={3} style={{ textAlign: 'center' }}>No History Added</CustomTableCell>
                    </CustomTableRow>
            }
            </TableBody>
        </Table>
    );
}

export default PatientHistory;