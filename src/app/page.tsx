"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Item } from "utils/types";

export default function Home() {
  const { push } = useRouter();

  const [itemList, setItemList] = useState<Array<Item>>([]);
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 });
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);

  const tableRef = useRef(null);
  const dragColumn = useRef<number | null>(null);
  const dragOverColumn = useRef<number | null>(null);

  const getItemList = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      console.log(response);
      setItemList(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getItemList();
  }, []);

  useEffect(() => {
    // Add event listener for arrow key navigation
    const handleKeyDown = (event: any) => {
      console.log(event);
      if (!tableRef.current) return;

      const { key } = event;
      let newRow = focusedCell.row;
      let newCol = focusedCell.col;

      switch (key) {
        case "ArrowUp":
          newRow = Math.max(focusedCell.row - 1, 0);
          break;
        case "ArrowDown":
          newRow = Math.min(focusedCell.row + 1, 3);
          break;
        case "ArrowLeft":
          newCol = Math.max(focusedCell.col - 1, 0);
          break;
        case "ArrowRight":
          newCol = Math.min(focusedCell.col + 1, 4);
          break;
        default:
          return;
      }

      setFocusedCell({ row: newRow, col: newCol });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedCell]);

  useEffect(() => {
    // Update selected image when focused cell changes
    const product = itemList[focusedCell.row * 5 + focusedCell.col];
    setSelectedProduct(product ? product : null);
  }, [focusedCell, itemList]);

  console.log(focusedCell);

  // const handleRedirect = (item: Item) => {
  //   push(`/items/${item.id}?imageUrl=${item.image}`);
  // };

  const dragStartColumn = (position: number) => {
    console.log("dragStartColumn", position);
    dragColumn.current = position;
  };

  const dragEnterColumn = (position: number) => {
    console.log("dragEnterColumn", position);
    dragOverColumn.current = position;
  };

  // Handle drop event
  const onDropColumn = () => {
    const copyColumns = [...itemList];
    const dragItemContent = copyColumns[dragColumn.current as number];
    copyColumns.splice(dragColumn.current as number, 1);
    copyColumns.splice(dragOverColumn.current as number, 0, dragItemContent);
    dragColumn.current = null;
    dragOverColumn.current = null;
    setItemList(copyColumns);
  };

  // Render table cells
  const renderTableCells = () => {
    let index = 0;
    const tableCells = [];

    for (let row = 0; row < 4; row++) {
      const rowCells = [];
      for (let col = 0; col < 5; col++) {
        const product = itemList[index] || {};
        const isActive = focusedCell.row === row && focusedCell.col === col;
        rowCells.push(
          <td
            key={index}
            className={isActive ? "active" : ""}
            draggable
            onDragStart={() => dragStartColumn(row * 5 + col)}
            onDragEnter={() => dragEnterColumn(row * 5 + col)}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragEnd={onDropColumn}
            onClick={() => setFocusedCell({ row, col })}
          >
            {product.id} - {product.title} {/* Display product information */}
          </td>
        );
        index++;
      }
      tableCells.push(<tr key={row}>{rowCells}</tr>);
    }

    return tableCells;
  };

  return (
    <div className="mainContainer">
      <table className="tableContainer" ref={tableRef}>
        <tbody>{renderTableCells()}</tbody>
      </table>
      <div className="productContainer">
        {selectedProduct?.image && (
          <div className="imageContainer">
            <img src={selectedProduct?.image} alt="image" />
          </div>
        )}
        {selectedProduct && (
          <div className="productDetails">
            <p>
              <strong>ID:</strong> {selectedProduct.id}
            </p>
            <p>
              <strong>Title:</strong> {selectedProduct.title}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Price:</strong> {selectedProduct.price}
            </p>
            <p>
              <strong>Rating:</strong> {selectedProduct.rating?.rate}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
