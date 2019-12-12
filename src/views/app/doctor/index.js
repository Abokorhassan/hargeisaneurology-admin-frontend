import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { connect } from "react-redux";

import DataListView from "../../../containers/pages/DataListView";
import Pagination from "../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import ListPageHeading from "../../../containers/pages/ListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
import AddNewModal from "../../../containers/pages/AddNewModal";

import { fetchDoctors } from "../../../redux/actions";

function collect(props) {
  return { data: props.data };
}

class Doctor extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require("mousetrap");
    this.state = {
      displayMode: "list",

      selectedPageSize: 3,
      selectedDoctors: [],

      totalDoctorCount:
        this.props.doctorsData && this.props.doctorsData.meta
          ? this.props.doctorsData.meta.total
          : 0,
      doctors:
        this.props.doctorsData && this.props.doctorsData.data
          ? this.props.doctorsData.data
          : [],

      totalPage:
        this.props.doctorsData && this.props.doctorsData.meta
          ? this.props.doctorsData.meta.last_page
          : 1,

      orderOptions: [
        { column: "first_name", label: "First Name" },
        { column: "email", label: "Email" },
        { column: "specialty", label: "Speciality" }
      ],
      pageSizes: [1, 2, 3],

      // categories: [
      //   { label: "Cakes", value: "Cakes", key: 0 },
      //   { label: "Cupcakes", value: "Cupcakes", key: 1 },
      //   { label: "Desserts", value: "Desserts", key: 2 }
      // ],

      selectedOrderOption: { column: "first_name", label: "First Name" }, // ----
      dropdownSplitOpen: false,
      modalOpen: false,
      currentPage: 1,
      search: "",
      lastChecked: null
    };
  }

  componentDidMount() {
    this.fetchingDoctors();

    this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedDoctors: []
      });
      return false;
    });
  }

  componentWillUnmount() {
    this.mouseTrap.unbind("ctrl+a");
    this.mouseTrap.unbind("command+a");
    this.mouseTrap.unbind("ctrl+d");
    this.mouseTrap.unbind("command+d");
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.fetchingDoctors()
    );
  };

  changePageSize = size => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.fetchingDoctors()
    );
  };

  changeDisplayMode = mode => {
    this.setState({
      displayMode: mode
    });
    return false;
  };

  onChangePage = page => {
    this.setState(
      {
        currentPage: page
      },
      () => this.fetchingDoctors()
    );
  };

  onSearchKey = e => {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.fetchingDoctors()
      );
    }
  };

  onCheckDoctor = (event, id) => {
    if (
      event.target.tagName === "A" ||
      (event.target.parentElement && event.target.parentElement.tagName === "A")
    ) {
      return true;
    }
    if (this.state.lastChecked === null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedDoctors = this.state.selectedDoctors;
    if (selectedDoctors.includes(id)) {
      selectedDoctors = selectedDoctors.filter(x => x !== id);
    } else {
      selectedDoctors.push(id);
    }
    this.setState({
      selectedDoctors
    });

    if (event.shiftKey) {
      var doctors = this.state.doctors;
      var start = this.getIndex(id, doctors, "id");
      var end = this.getIndex(this.state.lastChecked, doctors, "id");
      doctors = doctors.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedDoctors.push(
        ...doctors.map(Doctor => {
          return Doctor.id;
        })
      );
      selectedDoctors = Array.from(new Set(selectedDoctors));
      this.setState({
        selectedDoctors
      });
    }
    document.activeElement.blur();
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }

  handleChangeSelectAll = isToggle => {
    if (this.state.selectedDoctors.length >= this.state.doctors.length) {
      if (isToggle) {
        this.setState({
          selectedDoctors: []
        });
      }
    } else {
      this.setState({
        selectedDoctors: this.state.doctors.map(x => x.id)
      });
    }
    document.activeElement.blur();
    return false;
  };

  fetchingDoctors() {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;
    this.props.fetchDoctors({
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    });
  }

  static getDerivedStateFromProps({ doctorsData }, prevState) {
    if (!(Object.entries(doctorsData).length === 0)) {
      if (
        doctorsData.data !== prevState.doctors ||
        doctorsData.meta.total ||
        doctorsData.meta.last_page
      ) {
        return {
          doctors: doctorsData.data,
          totalDoctorCount: doctorsData.meta.total,
          totalPage: doctorsData.meta.last_page
        };
      } else {
        return null;
      }
    } else {
    }
    return null;
  }

  onContextMenuClick = (e, data, target) => {
    console.log(
      "onContextMenuClick - selected doctors",
      this.state.selectedDoctors
    );
    console.log("onContextMenuClick - action : ", data.action);
  };

  onContextMenu = (e, data) => {
    const clickedDoctorId = data.data;
    if (!this.state.selectedDoctors.includes(clickedDoctorId)) {
      this.setState({
        selectedDoctors: [clickedDoctorId]
      });
    }

    return true;
  };

  render() {
    const {
      currentPage,
      doctors,
      displayMode,
      selectedPageSize,
      totalDoctorCount,
      selectedOrderOption,
      selectedDoctors,
      orderOptions,
      pageSizes,
      modalOpen,
      categories
    } = this.state;
    const { match } = this.props;

    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;

    return this.props.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <ListPageHeading
            heading="doctor.list"
            displayMode={displayMode}
            changeDisplayMode={this.changeDisplayMode}
            handleChangeSelectAll={this.handleChangeSelectAll}
            changeOrderBy={this.changeOrderBy}
            changePageSize={this.changePageSize}
            selectedPageSize={selectedPageSize}
            totalDoctorCount={totalDoctorCount}
            selectedOrderOption={selectedOrderOption}
            match={match}
            startIndex={startIndex}
            endIndex={endIndex}
            selectedDoctorsLength={selectedDoctors ? selectedDoctors.length : 0}
            doctorsLength={doctors ? doctors.length : 0}
            onSearchKey={this.onSearchKey}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            toggleModal={this.toggleModal}
          />
          {/* <AddNewModal
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            categories={categories}
          /> */}
          <Row>
            {this.state.doctors.map(doctor => {
              if (this.state.displayMode === "imagelist") {
                return (
                  <ImageListView
                    key={doctor.id}
                    name_of={doctor}
                    isSelect={this.state.selectedDoctors.includes(doctor.id)}
                    collect={collect}
                    onCheckDoctor={this.onCheckDoctor}
                  />
                );
              } else if (this.state.displayMode === "thumblist") {
                return (
                  <ThumbListView
                    key={doctor.id}
                    name_of={doctor}
                    isSelect={this.state.selectedDoctors.includes(doctor.id)}
                    collect={collect}
                    onCheckDoctor={this.onCheckDoctor}
                  />
                );
              } else {
                return (
                  <DataListView
                    key={doctor.id}
                    name_of={doctor}
                    isSelect={this.state.selectedDoctors.includes(doctor.id)}
                    onCheckDoctor={this.onCheckDoctor}
                    collect={collect}
                  />
                );
              }
            })}{" "}
            <Pagination
              currentPage={this.state.currentPage}
              totalPage={this.state.totalPage}
              onChangePage={i => this.onChangePage(i)}
            />
            <ContextMenuContainer
              onContextMenuClick={this.onContextMenuClick}
              onContextMenu={this.onContextMenu}
            />
          </Row>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, doctorStates }) => {
  const { user, loading, error } = authUser;
  const { doctorsData, errorDoctors, isLoading } = doctorStates;
  return { user, loading, error, doctorsData, errorDoctors, isLoading };
};

export default connect(mapStateToProps, {
  fetchDoctors
})(Doctor);
