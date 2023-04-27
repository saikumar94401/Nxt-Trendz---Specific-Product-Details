import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemData: {},
    apiStatus: apiStatusConstants.initial,
    similarProducts: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductsItemDetails()
  }

  getProductsItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      this.setState({apiStatus: apiStatusConstants.success})
      const data = await response.json()
      console.log(data)

      const productItemData = {
        id: data.id,
        imageUrl: data.image_url,
        brand: data.brand,
        availability: data.availability,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        description: data.description,
      }

      const similarProducts = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        brand: each.brand,
        availability: each.availability,
        price: each.price,
        rating: each.rating,
        style: each.style,
        totalReviews: each.total_reviews,
        description: each.description,
        title: each.title,
      }))

      this.setState({
        productItemData,
        similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  incrementQuantity = () => {
    this.setState(prev => ({quantity: prev.quantity + 1}))
  }

  decrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prev => ({quantity: prev.quantity - 1}))
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  redirectToProductPage = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping"
        onClick={this.redirectToProductPage}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductItemView = () => {
    const {productItemData} = this.state
    const {
      imageUrl,
      title,
      price,
      totalReviews,
      description,
      availability,
      brand,
      rating,
    } = productItemData

    const {quantity, similarProducts} = this.state
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <div className="product-item-content-container">
            <h1 className="product-item-content-heading">{title}</h1>
            <p className="product-item-price">Rs {price}/-</p>
            <div className="product-item-start-review-container">
              <div className="product-item-star-container">
                <p className="stars-count">{rating}</p>
                <AiFillStar className="product-item-Aistar" />
              </div>
              <p className="product-item-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-item-description">{description}</p>
            <div className="product-item-avail-container">
              <p className="product-item-availability">Availability:</p>
              <p className="product-item-availability-count">{availability}</p>
            </div>

            <div className="product-item-avail-container">
              <p className="product-item-availability">Brand:</p>
              <p className="product-item-availability-count">{brand}</p>
            </div>

            <hr width="100%" color="#cbced2" className="hr-line" />
            <div className="product-item-quantity-container">
              <button
                type="button"
                className="plus-minus-buttons"
                onClick={this.incrementQuantity}
                data-testid="plus"
              >
                <BsPlusSquare className="inc-dec-icon" />
              </button>

              <p className="product-item-quantity">{quantity}</p>

              <button
                type="button"
                className="plus-minus-buttons"
                onClick={this.decrementQuantity}
                data-testid="minus"
              >
                <BsDashSquare className="inc-dec-icon" />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <SimilarProductItem similarProducts={similarProducts} />
      </>
    )
  }

  renderStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProductItemView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {productItemData, similarProducts} = this.state
    console.log(productItemData, similarProducts)

    return this.renderStatusView()
  }
}

export default ProductItemDetails
