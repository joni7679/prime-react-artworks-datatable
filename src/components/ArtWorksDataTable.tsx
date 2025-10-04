import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';

interface ArtWork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    date_start: number;
    date_end: number;
}

const ArtWorksDataTable: React.FC = () => {
    const [data, setData] = useState<ArtWork[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedData, setSelectedData] = useState<ArtWork[] | null>(null);
    const [currentPage, setCurrentPage] = useState(0)
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [inputVal, setInputValue] = useState<string>('');
    const op = useRef(null);
    const toast = useRef<Toast>(null);

    const getArtWorksData = async (page: number) => {
        setLoading(true);
        try {
            let res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            let finalRes: ArtWork[] = res.data.data;
            console.log("finalres", finalRes);
            setData(finalRes)
            console.log("finalres", finalRes);
            setTotal(res.data.pagination.total);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch please try agin leater", error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getArtWorksData(currentPage)
    }, [currentPage])

    const handlePagination = (e) => {
        setCurrentPage(e.page)
    }

    const showError = () => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid number', life: 3000 });
    }

    const showSuccess = () => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Rows  selected successfully', life: 3000 });
    }

    const handleSubmit = () => {
        const count: number = parseInt(inputVal);
        if (!inputVal || count <= 0) {
            showError();
            return;
        }
        const val = data.slice(0, count);
        setSelectedData(val);
        showSuccess();
        op.current?.hide();
    }
    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <OverlayPanel ref={op} style={{ width: "20rem" }} >
                    <InputText style={{ width: "100%" }} value={inputVal} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                        placeholder="Please Enter a number" />
                    <br /> <br />
                    <Button label="Submit" onClick={handleSubmit} />
                </OverlayPanel>
                <DataTable onClick={(e) => op.current.toggle(e)} paginator rows={12} value={data} lazy loading={loading}
                    totalRecords={total} selection={selectedData}
                    onSelectionChange={(e) => setSelectedData(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}
                    selectionMode={rowClick ? undefined : 'multiple'}
                    onPage={handlePagination}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="title" header="Title"></Column>
                    <Column field="place_of_origin" header="Place Of  Origin"></Column>
                    <Column field="artist_display" header="Arist Display"></Column>
                    <Column field="date_start" header="Date Start"></Column>
                    <Column field="date_end" header="Date End"></Column>
                </DataTable>
            </div>
        </>
    )
}

export default ArtWorksDataTable;


