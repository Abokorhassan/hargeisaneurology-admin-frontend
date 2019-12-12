import React from "react";
import {
  Row,
  Card,
  CardBody,
  CardSubtitle,
  CardImg,
  CardText,
  CustomInput,
  Badge
} from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../components/common/CustomBootstrap";

const ImageListView = ({ name_of, isSelect, collect, onCheckDoctor }) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={name_of.id}>
      <ContextMenuTrigger id="menu_id" data={name_of.id} collect={collect}>
        <Card
          onClick={event => onCheckDoctor(event, name_of.id)}
          className={classnames({
            active: isSelect
          })}
        >
          <div className="position-relative">
            <NavLink to={`?p=${name_of.id}`} className="w-40 w-sm-100">
              <CardImg
                top
                alt={name_of.first_name}
                src="/assets/img/fruitcake-thumb.jpg"
              />
            </NavLink>
            <Badge
              color={name_of.statusColor}
              pill
              className="position-absolute badge-top-left"
            >
              {name_of.specialty}
            </Badge>
          </div>
          <CardBody>
            <Row>
              <Colxx xxs="2">
                <CustomInput
                  className="item-check mb-0"
                  type="checkbox"
                  id={`check_${name_of.id}`}
                  checked={isSelect}
                  onChange={() => {}}
                  label=""
                />
              </Colxx>
              <Colxx xxs="10" className="mb-3">
                <CardSubtitle>{name_of.first_name}</CardSubtitle>
                <CardText className="text-muted text-small mb-0 font-weight-light">
                  {name_of.created_at}
                </CardText>
              </Colxx>
            </Row>
          </CardBody>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ImageListView);
