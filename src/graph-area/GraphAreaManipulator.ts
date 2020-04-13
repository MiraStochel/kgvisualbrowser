import Cytoscape, {AnimateOptions} from "cytoscape";
import {Node} from "../graph/Node";
import {Graph} from "../graph/Graph";

/**
 * This class performs basic operations with graph area like zooming, animations etc.
 */
export default class GraphAreaManipulator {
    animateOptions: AnimateOptions = {duration: 300};
    manualZoomScale: number = 2;

    /**
     * Cytoscape instance
     */
    cy: Cytoscape.Core;

    graph: Graph;

    constructor(cy: Cytoscape.Core, graph: Graph) {
        this.cy = cy;
        this.graph = graph;
    }

    zoomIn() {
        this.cy.animate({
            // @ts-ignore zoom accepts number
            zoom: this.cy.zoom() * this.manualZoomScale,
        }, this.animateOptions);
    }

    zoomOut() {
        this.cy.animate({
            // @ts-ignore zoom accepts number
            zoom: this.cy.zoom() / this.manualZoomScale,
        }, this.animateOptions);
    }

    fit(nodes?: string|Node|(string|Node)[]) {
        let nds: null|(string|Node)[];
        if (nodes === undefined) {
            nds = null;
        } else if (nodes instanceof Node || typeof nodes === 'string') {
            nds = [nodes];
        } else {
            nds = nodes;
        }

        let collection: Cytoscape.NodeCollection;
        if (nds === null) {
            collection = this.cy.nodes();
        } else {
            for (let node of nds) {
                if (node instanceof Node) {
                    collection.add(node.element.element);
                } else {
                    collection.add(this.graph.getNodeByIRI(node).element.element);
                }
            }
        }
        this.cy.animate({
            fit: {
                eles: collection,
                padding: 100,
            }
        }, this.animateOptions);
    }


}