import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Rating } from "flowbite-react";

export default function Preview({ isOpen = true, toggle, product }) {
  if (!product) return null; 

  return (
    <div>
    

    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
    <h1 className=" text-2xl font-bold text-gray-800 ">Products Details</h1>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Product Image Section */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="w-64 h-64 flex justify-center items-center bg-gray-100 rounded shadow">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Title */}
            <h3 className="text-xl font-semibold">{product.title}</h3>


            {/* Product ID */}
            <div className="text-sm text-gray-500">
              <strong>Product ID:</strong> {product.id}
            </div>


            {/* Rating */}
            <div className="flex items-center gap-2">
              <Rating>
                {Array.from({ length: 5 }, (_, i) => (
                  <Rating.Star
                    key={i}
                    filled={i < Math.round(product.rating.rate)}
                  />
                ))}
              </Rating>
              <span className="text-sm text-gray-500">
                ({product.rating.count} reviews)
              </span>
            </div>


            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-800">Description:</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
            

            {/* Price */}
            <div className="text-lg font-bold text-gray-700">
              Price:{" "}
              <span className="text-blue-500">${product.price.toFixed(2)}</span>
            </div>

           
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
        <Button color="primary">Add to Cart</Button>
      </ModalFooter>
    </Modal>
    </div>
  );
}






