import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const ProductsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [category, setCategory] = useState([])
const [brand, setBrand] = useState([])
const [packing, setPacking] = useState([])
const [weight, setWeight] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [category,brand,packing,weight], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            name: _entity?.name,serialNo: _entity?.serialNo,category: _entity?.category?._id,brand: _entity?.brand?._id,packing: _entity?.packing?._id,weight: _entity?.weight,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("products").create(_data);
        const eagerResult = await client
            .service("products")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "category",
                    service : "category",
                    select:["name"]},{
                    path : "brand",
                    service : "brand",
                    select:["name","company"]},{
                    path : "packing",
                    service : "packing",
                    select:["type"]},{
                    path : "weight",
                    service : "weight",
                    select:["amount","unit"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Products updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Products" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount category
                    client
                        .service("category")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCategoryId } })
                        .then((res) => {
                            setCategory(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Category", type: "error", message: error.message || "Failed get category" });
                        });
                }, []);

useEffect(() => {
                    // on mount brand
                    client
                        .service("brand")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleBrandId } })
                        .then((res) => {
                            setBrand(res.data.map((e) => { return { name: `${e["name"]}`,company: `${e["company"]}`, value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Brand", type: "error", message: error.message || "Failed get brand" });
                        });
                }, []);

useEffect(() => {
                    // on mount packing
                    client
                        .service("packing")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singlePackingId } })
                        .then((res) => {
                            setPacking(res.data.map((e) => { return { name: e['type'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Packing", type: "error", message: error.message || "Failed get packing" });
                        });
                }, []);

useEffect(() => {
                    // on mount weight
                    client
                        .service("weight")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleWeightId } })
                        .then((res) => {
                            setWeight(res.data.map((e) => { return { amount: `${e["amount"]}`,unit: `${e["unit"]}`, value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Weight", type: "error", message: error.message || "Failed get weight" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const categoryOptions = category.map((elem) => ({ name: elem.name, value: elem.value }));
const brandOptions = brand.map((elem) => ({ name: elem.name, value: elem.value }));
const packingOptions = packing.map((elem) => ({ name: elem.name, value: elem.value }));
const weightOptions = weight.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Products" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="products-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="name">Name:</label>
                <InputText id="name" className="w-full mb-3 p-inputtext-sm" value={_entity?.name} onChange={(e) => setValByKey("name", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["name"]) ? (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="serialNo">Serial No:</label>
                <InputText id="serialNo" className="w-full mb-3 p-inputtext-sm" value={_entity?.serialNo} onChange={(e) => setValByKey("serialNo", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["serialNo"]) ? (
              <p className="m-0" key="error-serialNo">
                {error["serialNo"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="category">Category:</label>
                <Dropdown id="category" value={_entity?.category?._id} optionLabel="name" optionValue="value" options={categoryOptions} onChange={(e) => setValByKey("category", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["category"]) ? (
              <p className="m-0" key="error-category">
                {error["category"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="brand">Brand:</label>
                <Dropdown id="brand" value={_entity?.brand?._id} optionLabel="name" optionValue="value" options={brandOptions} onChange={(e) => setValByKey("brand", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["brand"]) ? (
              <p className="m-0" key="error-brand">
                {error["brand"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="packing">Packing:</label>
                <Dropdown id="packing" value={_entity?.packing?._id} optionLabel="name" optionValue="value" options={packingOptions} onChange={(e) => setValByKey("packing", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["packing"]) ? (
              <p className="m-0" key="error-packing">
                {error["packing"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="weight">Weight:</label>
                <MultiSelect id="weight" value={_entity?.weight} options={weightOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("weight", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["weight"]) ? (
              <p className="m-0" key="error-weight">
                {error["weight"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ProductsCreateDialogComponent);
