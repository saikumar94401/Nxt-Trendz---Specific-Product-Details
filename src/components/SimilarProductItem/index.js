import './index.css'
import {AiFillStar} from 'react-icons/ai'

const SimilarProductItem = props => {
  const {similarProducts} = props
  console.log(similarProducts)

  const eachSimilarProduct = eachProduct => {
    const {imageUrl, title, brand, price, rating} = eachProduct
    return (
      <li className="each-similar-product-item" key={title}>
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="each-similar-product-image"
        />
        <p className="each-similar-product-title">{title}</p>
        <p className="each-similar-product-brand">by {brand}</p>
        <div className="each-similar-product-price-rating-container">
          <p className="each-similar-product-price">Rs {price}/-</p>
          <div className="each-similar-product-item-star-container">
            <p className="each-similar-product-stars-count">{rating}</p>
            <AiFillStar className="each-similar-product-item-Aistar" />
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="each-similar-product-container">
      <h1 className="each-similar-product-heading">Similar Products</h1>
      <ul className="each-similar-product-list">
        {similarProducts.map(eachProduct => eachSimilarProduct(eachProduct))}
      </ul>
    </div>
  )
}
export default SimilarProductItem
