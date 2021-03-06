import {useParams} from "react-router-dom";
import {useEffect, useReducer} from "react";
import axios from "axios";
import {Badge, Button, Card, Col, Form, ListGroup, Row} from "react-bootstrap";
import Rating from "../components/Rating";
import {Helmet} from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import {getError} from "../utils";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, product: action.payload, loading: false}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
        default:
            return state;
    }
}

function ProductScreen() {
    const params = useParams();
    const {slug} = params;

    const [{loading, error, product}, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: ''
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const result = await axios.get(`/api/products/slug/${slug}`);
                dispatch({type: 'FETCH_SUCCESS', payload: result.data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
                // setTimeout(() => {
                //     <Redirect to={'/'} />
                // }, 5000);
            }
        };
        fetchData();
    }, [slug]);

    return (
        loading ? (<LoadingBox />)
            :
            error ? (<MessageBox variant={'danger'}>{error}</MessageBox>)
                :
                (
                    <div>
                        <Row>
                            <Col md={6}>
                                <img src={product.image} alt={product.name} className={'img-large'}/>
                            </Col>
                            <Col md={3}>
                                <ListGroup variant={'flush'}>
                                    <Helmet>
                                        <title>Amazon | Products: {product.name}</title>
                                    </Helmet>
                                    <ListGroup.Item>
                                        <h1>{product.name}</h1>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Price: ??{product.price}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Description:
                                        <p>{product.description}</p>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <Card.Body>
                                        <ListGroup variant={'flush'}>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col>??{product.price}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col>
                                                        {
                                                            product.countInStock > 5 ? (<Badge bg={'success'}>In Stock</Badge>)
                                                                :
                                                                product.countInStock >= 1 ? (<Badge bg={'warning'} text={'dark'}>{product.countInStock} left</Badge>)
                                                                :
                                                                (<Badge bg={'danger'}>Unavailable</Badge>)
                                                        }
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Col>Quantity:</Col>
                                                <Col>
                                                    <Form>
                                                        <Form.Group className="mb-3" controlId="formGroupQuantity">
                                                            <Form.Control type="number" min={1} max={product.countInStock} defaultValue={1} />
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                            </ListGroup.Item>
                                            {
                                                product.countInStock > 0 && (
                                                    <ListGroup.Item>
                                                        <div className="d-grid">
                                                            <Button variant={'primary'}>
                                                                Add to Cart
                                                            </Button>
                                                        </div>
                                                    </ListGroup.Item>
                                                )
                                            }
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
    );
}

export default ProductScreen;