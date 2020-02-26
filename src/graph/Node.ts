import { Graph } from "./Graph";
import { NodeView } from "./NodeView";
import { NodeViewSet } from "./NodeViewSet";
import { ResponseElementType } from "../graph-fetcher/response-interfaces";

/**
 * Information about the type of Node. Same as ResponseElementType
 */
export interface NodeType extends ResponseElementType {};

/**
 * Node as a part of graph. Each Node belongs to exactly one Graph.
 */
export class Node {
    /**
     * Each Node must belong to one and only one Graph. Every update is reported to the graph instance. Also provides fetcher.
     */
    graph: Graph;

    /**
     * Node unique identifier
     * */
    IRI: string;

    constructor(IRI: string, graph: Graph) {
        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Whether the node is selected on the board
     */
    selected: boolean = false;
    visible: boolean = false;

    currentView: NodeView = null;

    viewSets: {
        [IRI: string]: NodeViewSet;
    } = null;

    async fetchViewSets() {
        if (this.viewSets) return;

        let result = await this.graph.fetcher.getViewSets(this.IRI);

        this.viewSets = {};

        let nodeViews: {[viewIRI:string]: NodeView} = {};
        for (let nv of result.views) {
            let view = new NodeView();
            view.IRI = nv.iri;
            view.label = nv.label;
            view.node = this;
            nodeViews[nv.iri] = view;
        }

        for (let vs of result.viewSets) {
            let viewSet = new NodeViewSet();
            this.viewSets[vs.iri] = viewSet;
            viewSet.IRI = vs.iri;
            viewSet.label = vs.label;
            viewSet.defaultView = nodeViews[vs.defaultView];
            for (let nv of vs.views) {
                viewSet.views[nv] = nodeViews[nv];
            }
        }
    }
}
