// import { defineGrid, extendHex } from 'honeycomb-grid';
// import svgjs from 'svg.js';

// const rootElement = document.getElementById('main')
// const draw = svgjs(rootElement)

// const Hex = extendHex({ orientation: 'flat', size: 50 })
// const Grid = defineGrid(Hex)
// const corners = Hex().corners()
// const hexSymbol = draw.symbol()
//     // map the corners' positions to a string and create a polygon
//     .polygon(corners.map(({ x, y }) => `${x},${y}`))
//     .fill('none')
//     .stroke({ width: 1, color: '#999' })

// // render 10,000 hexes
// Grid.rectangle({ width: 100, height: 100 }).forEach(hex => {
//     const { x, y } = hex.toPoint()
//     // use hexSymbol and set its position for each hex
//     draw.use(hexSymbol).translate(x, y)
// })
